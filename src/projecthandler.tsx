import { AbstractProject, AbstractProjectID } from '../shared/project'

/**
 * Function to get the names of the projects.
 *
 * @returns array of strings
 */
export function get_project_names(): string[] {
    return window.project.getNames()
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

    exists_locally(): boolean {
        return window.project.existsLocally(this.url)
    }

    get_project_dir(): string {
        return window.project.getProjectDir(this.url)
    }

    get_project_url(): URL {
        return this.url
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
