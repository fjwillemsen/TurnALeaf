import { AbstractProject, AbstractProjectID } from 'shared/project'

/**
 * The Project ID class, provides an interface for identifying projects.
 */
export class ProjectID extends AbstractProjectID {
    constructor(url: URL) {
        super(url)
    }

    protected make_hash(url: URL): string {
        return window.project.projectIDMakeHash(url)
    }

    exists_locally(): boolean {
        return window.project.projectIDExistsLocally(this.url)
    }

    get_project_dir(): string {
        return window.project.projectIDGetProjectDir(this.url)
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

    set name(name: string) {}

    async get_project_update() {}

    async push_project_update() {}

    delete_project() {}
}
