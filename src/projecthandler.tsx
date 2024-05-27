import path from 'path'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import * as fs from 'fs'
// import type { Dirent } from 'fs'
import Store from 'electron-store'
import { createHash } from 'crypto'

const hasher = createHash('md5')
type ProjectMapType = Map<string, Project>

type ProjectStoreType = {
    projects: ProjectMapType
}

const projectstore = new Store<ProjectStoreType>({
    defaults: {
        projects: new Map<string, Project>(),
    },
})

/**
 * Gets the stored projects.
 *
 * @returns ProjectMapType
 */
function get_projects(): ProjectMapType {
    return projectstore.get('projects')
}

/**
 * Sets the stored projects.
 *
 * @param ProjectMapType - projectmap
 */
function set_projects(projectmap: ProjectMapType) {
    projectstore.set('projects', projectmap)
}

/**
 * The Project ID class, provides an interface for identifying projects
 */
class ProjectID {
    readonly url: URL
    readonly hash: string

    /**
     * Creates an instance of ProjectID.
     *
     * @param url - the URL to the project
     */
    constructor(url: URL) {
        this.url = url
        this.hash = this.make_hash(url)
    }

    /**
     * Makes a hash out of the URL.
     *
     * @param url - the URL to hash
     * @returns hash string
     */
    private make_hash(url: URL): string {
        return hasher.update(url.toString()).digest('hex')
    }

    /**
     * Checks whether the project ID exists locally.
     *
     * @returns boolean, whether the project ID exists locally.
     */
    exists_locally(): boolean {
        return get_projects().has(this.hash)
    }

    /**
     * Gets the directory of this project.
     *
     * @returns absolute path
     */
    get_project_dir(): string {
        return path.join(get_projects_dir(), this.hash)
    }

    /**
     * Gets the URL to the remote repository this project belongs to.
     *
     * @returns URL
     */
    get_project_url(): URL {
        return this.url
    }
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
 * Function to clone a project locally, or return an existing project.
 *
 * @param url - the project URL
 * @returns [Project, boolean] - the project object, and whether the project is newly cloned
 */
export function create_project(url: URL): [Project, boolean] {
    const id = new ProjectID(url)
    if (id.exists_locally()) {
        return [get_projects().get(id.hash)!, false]
    } else {
        git.clone({
            fs,
            http,
            dir: id.get_project_dir(),
            url: id.get_project_url().toString(),
        })
            .then(console.log)
            .catch((e) => {
                throw e
            })
        return [new Project(id), true]
    }
}

/**
 * The Project class, exposing functions relating to the handling of locally existing projects.
 */
export class Project {
    readonly id: ProjectID
    private _name: string

    /**
     * Creates an instance of Project.
     *
     * @param id - the ProjectID
     */
    constructor(id: ProjectID) {
        this.id = id
        this._name = id.hash
        if (!this.id.exists_locally()) {
            this.save_in_store()
        }
    }

    private save_in_store() {
        const projects = get_projects()
        projects.set(this.id.hash, this)
        set_projects(projects)
    }

    private remove_from_store() {
        const projects = get_projects()
        projects.delete(this.id.hash)
        set_projects(projects)
    }

    public get name(): string {
        return this._name
    }

    public set name(v: string) {
        this._name = v
    }

    /**
     * Fetch updates to the project from remote.
     *
     */
    async get_project_update() {
        // git.fetch({ fs, http });
    }

    /**
     * Push updates of the project to remote.
     *
     */
    async push_project_update() {
        // git.commit();
    }

    /**
     * Delete the project locally.
     */
    public delete_project() {
        fs.rmSync(this.id.get_project_dir(), { recursive: true, force: true })
        this.remove_from_store()
    }
}
