import { FileArray } from '@aperturerobotics/chonky'

/**
 * The Project ID class, provides identification and location of projects.
 */
export abstract class AbstractProjectID {
    protected readonly _url_string: string
    protected readonly _hash: string

    /**
     * Creates an instance of ProjectID.
     *
     * @param url - the URL to the project.
     */
    constructor(url: URL) {
        this._url_string = url.toString()
        this._hash = this.make_hash(url)
    }

    /**
     * Makes a hash out of the URL.
     *
     * @param url - the URL to hash.
     * @returns string - the hash.
     */
    protected abstract make_hash(url: URL): string

    /**
     * Gets the hash identifying this project.
     *
     * @returns string - the hash identifyer.
     */
    abstract get hash(): string

    /**
     * Gets the URL to the remote repository this project belongs to.
     *
     * @returns URL - the URL of the remote repository.
     */
    abstract get url(): URL

    /**
     * Gets the project directory on disk.
     *
     * @returns string - absolute path to the directory.
     */
    abstract get directory(): string

    /**
     * Checks whether the project directory exists on disk.
     *
     * @returns boolean - whether the directory exists.
     */
    abstract exists_dir(): boolean

    /**
     * Remove the project directory on disk.
     */
    abstract remove_dir(): void

    /**
     * Checks whether the project ID exists locally.
     *
     * @returns boolean - whether the project ID exists locally.
     */
    abstract exists_locally(): boolean
}

/**
 * The Project class, exposing functions relating to the handling of locally existing projects.
 */
export abstract class AbstractProject {
    readonly _id_url_string: string
    readonly _hash: string
    protected _name: string

    /**
     * Creates an instance of Project.
     *
     * @param id - the ProjectID
     */
    constructor(id: AbstractProjectID) {
        this._id_url_string = id.url.toString()
        this._hash = id.hash
        if (id.exists_locally()) {
            this._name = id.hash
            this.get_name().then((name) => {
                this._name = name
            })
        } else {
            this._name = id.hash
            this.save_in_store()
        }
    }

    /**
     * Saves this project in the local store.
     *
     */
    protected abstract save_in_store(): void

    /**
     * Removes this prooject from the local store.
     *
     */
    protected abstract remove_from_store(): void

    /**
     * Helper function to retrieve the name during construction.
     *
     * @returns string - the name of the project.
     */
    protected abstract get_name(): Promise<string>

    /**
     * Retrieves the name of the project.
     *
     * @returns string - the name of the project
     */
    abstract get name(): string

    /**
     * Sets the name of the project.
     *
     * @param string - the name of the project.
     */
    abstract set name(name: string)

    /**
     * Gets the ProjectID of this project.
     *
     * @returns AbstractProjectID - the ProjectID.
     */
    abstract get id(): AbstractProjectID

    /**
     * Fetch updates to the project from remote.
     *
     * @returns boolean - true if an update is available, false otherwise.
     */
    abstract get_project_update(): Promise<boolean>

    /**
     * Apply an available update
     *
     * @returns void
     */
    abstract apply_project_update(): Promise<void>

    /**
     * Push updates of the project to remote.
     *
     * @returns string | void - the SHA of the commit.
     */
    abstract push_project_update(): Promise<string | void>

    /**
     * Delete the project locally.
     */
    abstract delete_project(): void

    /**
     * Get the list of project files and folders.
     *
     * @returns FileArray - Chonky file array containing the files and folders.
     */
    abstract get_files(): Promise<FileArray>

    /**
     * Get the contents of a file in the project directory.
     *
     * @param string - the filepath to the file relative to the project directory.
     * @returns Promise<Uint8Array> - the contents of the file as a byte array.
     */
    abstract get_file_contents(filepath: string): Promise<Uint8Array>

    /**
     * Set the contents of a file in the project directory to the buffer.
     *
     * @param string - the filepath to the file relative to the project directory.
     * @param Uint8Array - the byte array of the file contents.
     */
    abstract set_file_contents(filepath: string, contents: Uint8Array): Promise<void | string>
}
