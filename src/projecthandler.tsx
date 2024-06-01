import { AbstractProject, AbstractProjectID } from 'shared/project'

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

    get name(): string {
        return this._name
    }

    set name(name: string) {
        this._name = name
        window.project.setName(this.id.url)
    }

    async get_project_update() {
        return await window.project.getUpdate(this.id.url)
    }

    async push_project_update() {
        return await window.project.pushUpdate(this.id.url)
    }

    async delete_project() {
        return await window.project.delete(this.id.url)
    }
}
