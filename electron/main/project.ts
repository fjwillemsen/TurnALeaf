import { AbstractProject, AbstractProjectID } from '../../shared/project'

import path from 'path'
import git, { AuthCallback } from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'
// import type { Dirent } from 'fs'
import { createHash } from 'crypto'
import Store from 'electron-store'
import Settings from './settings'

// --------- Initialize the local storage ---------

type ProjectMapType = Map<string, Project>

type ProjectStoreType = {
    projects: ProjectMapType
}

const projectstore = new Store<ProjectStoreType>({})

// --------- Define the helper functions ---------

const settings = new Settings()

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
 * @returns [Project, boolean] - the project object, and whether the project is newly cloned
 */
export function create_project(
    url_string: string
): [Project, boolean] | undefined {
    const id = new ProjectID(new URL(url_string))
    if (id.exists_locally()) {
        return [get_project(id.hash)!, false]
    } else {
        git.clone({
            fs,
            http,
            dir: id.get_project_dir(),
            url: id.get_project_url().toString(),
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

    exists_locally(): boolean {
        const projects = get_projects()
        if (Object.keys(projects).length == 0) {
            return false
        }
        return projects.has(this.hash)
    }

    get_project_dir(): string {
        return path.join(get_projects_dir(), this.hash)
    }

    get_project_url(): URL {
        return this.url
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

    async get_project_update(): Promise<void> {
        // git.fetch({ fs, http });
    }

    async push_project_update(): Promise<void> {
        // git.commit();
    }

    delete_project() {
        fs.rmSync(this.id.get_project_dir(), { recursive: true, force: true })
        this.remove_from_store()
    }
}
