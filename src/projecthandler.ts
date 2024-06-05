import { AbstractProject, AbstractProjectID } from '../shared/project'

/**
 * Function to get the names and hashes of the projects.
 *
 * @returns [string, string][] - array of [name, hash]
 */
export function get_project_names(): Promise<[string, string][]> {
    return window.project.getNames()
}

/**
 * Function to clone a project locally, or return an existing project.
 *
 * @param URL - the project URL
 * @returns [Project, boolean] - the project object, and whether the project is newly cloned
 */
export function create_project(
    url: URL,
    overwrite: boolean
): Promise<[Project, boolean]> {
    return window.project.create(url.toString(), overwrite)
}

/**
 * The Project ID class, provides an interface for identifying projects.
 */
export class ProjectID extends AbstractProjectID {
    constructor(url: URL) {
        super(url)
    }

    protected make_hash(url: URL): string {
        return window.projectID.makeHash(url)
    }

    get hash(): string {
        return this._hash
    }

    get url(): URL {
        return new URL(this._url_string)
    }

    get directory(): string {
        return window.project.getProjectDir(this.url)
    }

    exists_dir(): boolean {
        throw new Error('Method not implemented.')
    }
    remove_dir(): void {
        throw new Error('Method not implemented.')
    }

    exists_locally(): boolean {
        return window.project.existsLocally(this.url)
    }
}

/**
 * The Project class, exposing functions relating to the handling of locally existing projects.
 */
export class Project extends AbstractProject {
    constructor(id: ProjectID) {
        super(id)
    }

    protected save_in_store() {}

    protected remove_from_store() {}

    protected get_name(): string {
        return window.project.getName(this.id.url)
    }

    get name(): string {
        return this._name
    }

    set name(name: string) {
        this._name = name
        window.project.setName(this.id.url)
    }

    get id(): ProjectID {
        return new ProjectID(new URL(this._id_url_string))
    }

    async get_project_update(): Promise<void> {
        return await window.project.getUpdate(this.id.url)
    }

    async push_project_update(): Promise<void> {
        return await window.project.pushUpdate(this.id.url)
    }

    delete_project(): void {
        return window.project.delete(this.id.url)
    }
}
