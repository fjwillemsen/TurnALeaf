/**
 * The Project ID class, provides an interface for identifying projects.
 */
export abstract class AbstractProjectID {
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
    protected abstract make_hash(url: URL): string

    /**
     * Checks whether the project ID exists locally.
     *
     * @returns boolean, whether the project ID exists locally.
     */
    abstract exists_locally(): boolean

    /**
     * Gets the directory of this project.
     *
     * @returns absolute path
     */
    abstract get_project_dir(): string

    /**
     * Gets the URL to the remote repository this project belongs to.
     *
     * @returns URL
     */
    abstract get_project_url(): URL
}

/**
 * The Project class, exposing functions relating to the handling of locally existing projects.
 */
export abstract class AbstractProject {
    readonly id: AbstractProjectID
    private _name: string

    /**
     * Creates an instance of Project.
     *
     * @param id - the ProjectID
     */
    constructor(id: AbstractProjectID) {
        this.id = id
        this._name = id.hash
        if (!this.id.exists_locally()) {
            this.save_in_store()
        }
    }

    protected abstract save_in_store(): void

    protected abstract remove_from_store(): void

    abstract get name(): string

    abstract set name(v: string)

    /**
     * Fetch updates to the project from remote.
     *
     */
    abstract get_project_update()

    /**
     * Push updates of the project to remote.
     *
     */
    abstract push_project_update(): void

    /**
     * Delete the project locally.
     */
    abstract delete_project(): void
}
