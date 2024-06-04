import { AbstractProject, AbstractProjectID } from '../../shared/project'

import path from 'path'
import git, { AuthCallback } from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'
// import type { Dirent } from 'fs'
import { createHash } from 'crypto'
import Store from 'electron-store'
import { settings } from './settings'

// --------- Initialize the local storage ---------

type ProjectMapType = Map<string, Project>

type ProjectStoreType = {
    projects: ProjectMapType
}

const projectstore = new Store<ProjectStoreType>({})
remove_projects()

// --------- Define the helper functions ---------

/**
 * Gets the stored projects.
 *
 * @returns ProjectMapType
 */
function get_projects(): ProjectMapType {
    const projects = projectstore.get('projects')
    if (projects == undefined || Object.keys(projects).length === 0) {
        return new Map<string, Project>()
    }
    return new Map(projects)
}

/**
 * Sets the stored projects.
 *
 * @param ProjectMapType - projectmap
 */
function set_projects(projectmap: ProjectMapType) {
    projectstore.set('projects', Array.from(projectmap.entries()))
}

/**
 * Removes all local projects, both on disk and in storage.
 */
function remove_projects() {
    fs.rmSync(get_projects_dir(), { recursive: true, force: true })
    projectstore.reset()
}

/**
 * Gets the directory where all projects reside.
 *
 * @returns absolute path
 */
function get_projects_dir(): string {
    return path.join(process.cwd(), 'projects')
}

// /**
//  * Gets a list of all project folder names.
//  *
//  * @returns list of strings
//  */
// function get_projects_folders_list(): string[] {
//     return fs
//         .readdirSync(get_projects_dir(), { withFileTypes: true })
//         .filter((dir_ent: Dirent) => dir_ent.isDirectory())
//         .map((dir_ent: Dirent) => dir_ent.name)
// }

// function validate_projects() {
//     get_projects()
// }

/**
 * Function to get the names of the projects.
 *
 * @returns array of strings
 */
export function get_project_names(): string[] {
    return Array.from(get_projects(), ([, value]) => value.name)
}

/**
 * Function to get a Project instance from the store by its hash.
 *
 * @param string - hash
 * @returns (Project | undefined) - the Project instance, or undefined if not existing.
 */
export function get_project(hash: string): Project | undefined {
    return get_projects().get(hash)
}

/**
 * Function to get for the authentication for `onAuth`. See https://isomorphic-git.org/docs/en/onAuth.
 *
 * @param URL - the URL
 * @returns AuthCallback - the authentication details
 */
const get_auth: AuthCallback = (url: string) => {
    const url_hostname = new URL(url).hostname
    if (url_hostname.includes('overleaf.com')) {
        return {
            username: 'git',
            password: settings.git_token_overleaf,
        }
    }
    throw new Error(`Authentication not defined for hostname ${url_hostname}`)
}

/**
 * Function to clone a project locally, or return an existing project.
 *
 * @param string - the project URL as a string
 * @param boolean - whether to overwrite the project if it exists on disk
 * @returns [Project, boolean] - the project object, and whether the project is newly cloned
 */
export function create_project(
    url_string: string,
    overwrite: boolean
): [Project, boolean] | undefined {
    const id = new ProjectID(new URL(url_string))
    if (id.exists_locally()) {
        return [get_project(id.hash)!, false]
    } else {
        if (id.exists_dir()) {
            if (overwrite) {
                id.remove_dir()
            } else {
                throw new Error(
                    `Project with hash ${id.hash} already exists on disk`
                )
            }
        }
        git.clone({
            fs,
            http,
            dir: id.directory,
            url: id.url.toString(),
            onAuth: get_auth,
        })
            .then(() => {
                return [new Project(id), true]
            })
            .catch((e) => {
                console.error(e)
                throw e
            })
    }
}

// --------- Define the ProjectID class ---------
/**
 * The Project ID class, provides an interface for identifying projects.
 */
export class ProjectID extends AbstractProjectID {
    constructor(url: URL) {
        super(url)
    }

    protected make_hash(url: URL): string {
        const hasher = createHash('md5')
        return hasher.update(url.toString()).digest('hex')
    }

    get url(): URL {
        return new URL(this._url_string)
    }

    get hash(): string {
        return this._hash
    }

    get directory(): string {
        return path.join(get_projects_dir(), this.hash)
    }

    exists_dir(): boolean {
        return fs.existsSync(this.directory)
    }

    remove_dir() {
        fs.rmSync(this.directory, { recursive: true, force: true })
    }

    exists_locally(): boolean {
        const projects = get_projects()
        if (Object.keys(projects).length == 0) {
            return false
        }
        return projects.has(this.hash) && this.exists_dir()
    }
}

// --------- Define the Project class ---------
/**
 * The Project class, exposing functions relating to the handling of locally existing projects.
 */
export class Project extends AbstractProject {
    constructor(id: ProjectID) {
        super(id)
    }

    protected save_in_store(): void {
        const projects = get_projects()
        projects.set(this.id.hash, this)
        set_projects(projects)
    }

    protected remove_from_store(): void {
        const projects = get_projects()
        projects.delete(this.id.hash)
        set_projects(projects)
    }

    protected get_name(): string {
        return this._name
    }

    get name(): string {
        return this._name
    }

    set name(name: string) {
        this._name = name
        this.save_in_store()
    }

    get id(): ProjectID {
        return new ProjectID(new URL(this._id_url_string))
    }

    async get_project_update(): Promise<void> {
        // git.fetch({ fs, http });
    }

    async push_project_update(): Promise<void> {
        // git.commit();
    }

    delete_project() {
        this.id.remove_dir()
        this.remove_from_store()
    }
}
