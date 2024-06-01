import { AbstractProject, AbstractProjectID } from 'shared/project'
import path from 'path'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import * as fs from 'fs'
// import type { Dirent } from 'fs'
import { createHash } from 'crypto'
import Store from 'electron-store'

// --------- Initialize the local storage ---------

type ProjectMapType = Map<string, Project>

type ProjectStoreType = {
    projects: ProjectMapType
}

const projectstore = new Store<ProjectStoreType>({
    defaults: {
        projects: new Map<string, Project>(),
    },
})

// --------- Define the helper functions ---------

const hasher = createHash('md5')

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

// --------- Define the ProjectID class ---------
/**
 * The Project ID class, provides an interface for identifying projects.
 */
export class ProjectID extends AbstractProjectID {
    constructor(url: URL) {
        super(url)
    }

    protected make_hash(url: URL): string {
        return hasher.update(url.toString()).digest('hex')
    }

    exists_locally(): boolean {
        return get_projects().has(this.hash)
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

    get name(): string {
        return this._name
    }

    set name(name: string) {
        this._name = name
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
