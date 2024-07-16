import { FileArray } from '@aperturerobotics/chonky'

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
export function create_project(url: URL, overwrite: boolean): Promise<[Project, boolean]> {
    return window.project.create(url.toString(), overwrite)
}

/**
 * Get a Project instance using a hash.
 *
 * @param string - hash
 * @returns Project - the project instance
 */
export async function get_project(hash: string): Promise<Project> {
    const url = new URL(await window.project.hashToURL(hash))
    const proj = await new Project(new ProjectID(url))
    if ((await proj.id.url.toString()) !== url.toString()) {
        throw new Error(`Inconsistent URLs: ${url.toString()} != ${await proj.id.url.toString()}`)
    }
    if ((await proj._hash) !== hash) {
        throw new Error(`Inconsistent hashes: ${hash} != ${await proj._hash}`)
    }
    return proj
}

/**
 * The Project ID class, provides an interface for identifying projects.
 */
export class ProjectID extends AbstractProjectID {
    constructor(url: URL) {
        super(url)
    }

    protected make_hash(url: URL): string {
        return window.projectID.makeHash(url.toString())
    }

    get hash(): string {
        return this._hash
    }

    get url(): URL {
        return new URL(this._url_string)
    }

    get directory(): string {
        return window.projectID.getProjectDir(this.url.toString())
    }

    exists_dir(): boolean {
        throw new Error('Method not implemented.')
    }
    remove_dir(): void {
        throw new Error('Method not implemented.')
    }

    exists_locally(): boolean {
        return window.projectID.existsLocally(this.url.toString())
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

    protected async get_name(): Promise<string> {
        return await window.project.getName(await this.id.hash)
    }

    get name(): string {
        return this._name
    }

    set name(name: string) {
        this._name = name
        window.project.setName(this.id.hash, name)
    }

    get id(): ProjectID {
        return new ProjectID(new URL(this._id_url_string))
    }

    async get_project_update(): Promise<boolean> {
        return await window.project.getUpdate(await this.id.hash)
    }

    async push_project_update(): Promise<string> {
        return await window.project.pushUpdate(await this.id.hash)
    }

    async delete_project(): Promise<void> {
        return await window.project.delete(await this.id.hash)
    }

    async get_files(): Promise<FileArray> {
        return await window.project.getFiles(await this.id.hash)
    }

    async get_file_contents(filepath: string): Promise<Uint8Array> {
        return await window.project.getFileContents(await this.id.hash, filepath)
    }

    async set_file_contents(filepath: string, contents: Uint8Array): Promise<void> {
        return await window.project.setFileContents(await this.id.hash, filepath, contents)
    }
}
