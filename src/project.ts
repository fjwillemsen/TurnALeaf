import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'
import { setTimeout } from 'timers/promises'

import { FileArray } from '@aperturerobotics/chonky'
import Store from 'electron-store'
import git, { AuthCallback } from 'isomorphic-git'
import http from 'isomorphic-git/http/node'

import { settings } from '@/settings'
import { AbstractProject, AbstractProjectID } from '@shared/project'

// import type { Dirent } from 'fs'

// --------- Initialize the local storage ---------

type ProjectMapType = Map<string, Project>

type ProjectStoreType = {
    projects: ProjectMapType
}

const projectstore = new Store<ProjectStoreType>({})
let projects_cache = new Map<string, Project>()

// --------- Define the helper functions ---------

/**
 * Updates the project cache by fetching from projectstore.
 *
 */
function update_projects_cache(): void {
    const projects_values = projectstore.get('projects')
    if (projects_values == undefined || Object.keys(projects_values).length === 0) {
        return
    }
    const updated_projects_cache = new Map<string, Project>()
    new Map(projects_values).forEach((project, hash) => {
        const projectid = new ProjectID(new URL(project._id_url_string))
        updated_projects_cache.set(hash, new Project(projectid))
    })
    projects_cache = updated_projects_cache
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
 * Removes all local projects, both on disk and in storage.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function remove_projects() {
    fs.rmSync(get_projects_dir(), { recursive: true, force: true })
    projectstore.delete('projects')
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
//     projects_cache
// }

/**
 * Function to get the names and hashes of the projects.
 *
 * @returns [string, string][] - array of [name, hash]
 */
export function get_project_names(): [string, string][] {
    return Array.from(projects_cache, ([, value]) => [value.name, value.id.hash])
}

/**
 * Function to get a Project instance from the store by its hash.
 *
 * @param string - hash
 * @returns (Project | undefined) - the Project instance, or undefined if not existing.
 */
export function get_project(hash: string): Project | undefined {
    if (projects_cache.has(hash) !== true) {
        throw new Error(`Project with hash ${hash} not in projects_cache`)
    }
    return projects_cache.get(hash)
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
 * Get the Git author details from settings.
 *
 * @returns Object - the author object.
 */
function get_author() {
    return {
        name: settings.git_author_name,
        email: settings.git_author_email,
    }
}

/**
 * Function to clone a project locally, or return an existing project.
 *
 * @param string - the project URL as a string
 * @param boolean - whether to overwrite the project if it exists on disk
 * @returns [Project, boolean] - the project object, and whether the project is newly cloned
 */
export async function create_project(url_string: string, overwrite: boolean): Promise<[Project, boolean] | undefined> {
    const id = new ProjectID(new URL(url_string))
    if (id.exists_locally()) {
        return [get_project(id.hash)!, false]
    } else {
        if (id.exists_dir()) {
            if (overwrite) {
                id.remove_dir()
            } else {
                throw new Error(`Project with hash ${id.hash} already exists on disk`)
            }
        }
        await git
            .clone({
                fs,
                http,
                dir: id.directory,
                url: id.url.toString(),
                onAuth: get_auth,
            })
            .then(() => {
                const dir = id.directory
                fs.copyFileSync(path.join(process.env.VITE_PUBLIC, 'defaultgitignore'), path.join(dir, '.gitignore'))
                git.add({ fs, dir: dir, filepath: '.gitignore' })
                git.commit({
                    fs,
                    dir: dir,
                    message: `Via ${process.env.APPNAME}: added default gitignore file`,
                })
                return [new Project(id), true]
            })
            .catch((e) => {
                id.remove_dir()
                throw new Error(`Failed to clone project, reason: ${e.message}`)
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

    get url(): URL {
        return new URL(this._url_string)
    }

    get hash(): string {
        return this._hash
    }

    get directory(): string {
        return path.join(get_projects_dir(), this.hash)
    }

    exists_dir(): boolean {
        return fs.existsSync(this.directory)
    }

    remove_dir() {
        fs.rmSync(this.directory, { recursive: true, force: true })
    }

    exists_locally(): boolean {
        return projects_cache.has(this.hash) && this.exists_dir()
    }
}

// --------- Define the Project class ---------
/**
 * The Project class, exposing functions relating to the handling of locally existing projects.
 */
export class Project extends AbstractProject {
    executing_commit = false
    executing_push = false
    executing_pull = false

    constructor(id: ProjectID) {
        super(id)
    }

    protected save_in_store(): void {
        projects_cache.set(this.id.hash, this)
        set_projects(projects_cache)
    }

    protected remove_from_store(): void {
        projects_cache.delete(this.id.hash)
        set_projects(projects_cache)
    }

    protected get_name(): Promise<string> {
        return new Promise(() => this._name)
    }

    get name(): string {
        return this._name
    }

    set name(name: string) {
        this._name = name
        this.save_in_store()
    }

    get id(): ProjectID {
        return new ProjectID(new URL(this._id_url_string))
    }

    /**
     * Get the list of unstaged files.
     *
     * @returns string[] - the list of filenames.
     */
    async get_files_to_add(): Promise<string[]> {
        const dir = this.id.directory
        const FILE = 0,
            WORKDIR = 2,
            STAGE = 3
        return (await git.statusMatrix({ fs, dir }))
            .filter((row) => row[WORKDIR] !== row[STAGE])
            .map((row) => row[FILE])
    }

    /**
     * Get the status of files that were changed relative to the last commit.
     *
     * @returns string[] - list of `type of change`: `filename`.
     */
    async get_files_changed_status(): Promise<string[]> {
        const FILE = 0,
            HEAD = 1,
            WORKDIR = 2,
            STAGE = 3

        type statusMap = {
            [id: string]: string
        }

        const statusMapping: statusMap = {
            '003': 'added, staged, deleted unstaged',
            '020': 'new, untracked',
            '022': 'added, staged',
            '023': 'added, staged, with unstaged changes',
            '100': 'deleted, staged',
            '101': 'deleted, unstaged',
            '103': 'modified, staged, deleted unstaged',
            '111': 'unmodified',
            '121': 'modified, unstaged',
            '122': 'modified, staged',
            '123': 'modified, staged, with unstaged changes',
        }

        const statusMatrix = (await git.statusMatrix({ fs, dir: this.id.directory })).filter(
            (row) => row[HEAD] !== row[WORKDIR] || row[HEAD] !== row[STAGE],
        )

        const allUncommitedChanges = statusMatrix.map((row) => statusMapping[row.slice(1).join('')] + ': ' + row[FILE])
        return allUncommitedChanges
    }

    get_generated_commit_message(multiline = false): Promise<string> {
        return this.get_files_changed_status().then((changes) => {
            if (changes.length == 0) {
                return ''
            }
            changes = changes.map((change) => {
                return change.replace(/,.*:/gm, '')
            })
            const changes_string = changes.join(multiline ? '\n' : ', ')
            return `Via ${process.env.APPNAME}:${multiline && changes.length > 1 ? '\n' : ' '}${changes_string}`
        })
    }

    /**
     * Function to get the last commit in the local log.
     *
     * @returns Promise<string> - the hash as a string.
     */
    async get_last_hash(): Promise<string> {
        // if we're concurrently executing a commit, wait until it is resolved
        if (this.executing_commit == true) {
            await setTimeout(100)
        }
        const dir = await this.id.directory
        const log = await git.log({ fs, dir: dir, depth: 1 })
        if (log.length == 0) {
            return undefined
        }
        return log[0].oid
    }

    async get_project_update(): Promise<boolean> {
        // if we're concurrently executing a push, wait until it is resolved
        if (this.executing_push == true) {
            await setTimeout(500)
        }
        // if the push is still not resolved, return false
        if (this.executing_push == true) {
            return false
        }

        // get the hash of the last local commit
        const last_hash = await this.get_last_hash()
        if (last_hash == undefined) {
            return true
        }

        // get the hash of the last remote commit
        const dir = await this.id.directory
        const res = await git.fetch({
            fs,
            http,
            dir: dir,
            depth: 1,
            singleBranch: true,
            tags: false,
            onAuth: get_auth,
        })
        if (res == undefined || res.fetchHead == undefined) {
            return false
        }

        // compare the last local and remote commit hashes
        // console.warn(`remote: ${res.fetchHead}, local: ${last_hash}`)
        return res.fetchHead != last_hash
    }

    async apply_project_update(): Promise<void> {
        // if there is a concurrent push, use incremental backoff to wait
        let backoff_counter = 0
        while (this.executing_push == true) {
            backoff_counter++
            const delay_ms = backoff_counter ** 2 * 500
            console.warn(
                `Applying project update not possible while executing push. Waiting ${delay_ms / 1000} seconds.`,
            )
            await setTimeout(delay_ms)
        }

        // use git pull to apply the update
        this.executing_pull = true
        const dir = await this.id.directory
        await git.pull({
            fs,
            http,
            dir: dir,
            singleBranch: true,
            onAuth: get_auth,
            author: get_author(),
        })
        this.executing_pull = false
    }

    async push_project_update(): Promise<string | void> {
        // if there is a concurrent pull, use incremental backoff to wait
        let backoff_counter = 0
        while (this.executing_pull == true) {
            backoff_counter++
            const delay_ms = backoff_counter ** 2 * 500
            console.warn(
                `Pushing project update not possible while executing pull. Waiting ${delay_ms / 1000} seconds.`,
            )
            await setTimeout(delay_ms)
        }

        this.executing_push = true
        this.executing_commit = true
        const dir = await this.id.directory
        const filesToAdd = await this.get_files_to_add()
        if (filesToAdd.length > 0) {
            git.add({
                fs,
                dir: dir,
                filepath: filesToAdd,
            })
        }
        const message = await this.get_generated_commit_message(false)
        let sha = undefined
        if (message.length > 0) {
            sha = await git.commit({
                fs,
                dir: dir,
                message: message,
                author: get_author(),
            })
            console.log('SHA: ', sha)
        }
        this.executing_commit = false
        const push = await git.push({
            fs,
            http,
            dir: dir,
            remote: 'origin',
            ref: 'master',
            onAuth: get_auth,
        })
        console.log('push result: ', push)
        this.executing_push = false
        if (sha !== undefined) {
            return sha
        }
    }

    delete_project() {
        this.id.remove_dir()
        this.remove_from_store()
    }

    get_files(): Promise<FileArray> {
        const dir = this.id.directory
        const is_hidden_file = (filename: string) => /^\..*/.test(filename)
        return fs.promises.readdir(dir).then((filenames) => {
            return filenames.map((f) => {
                const filepath = path.join(dir, f)
                const stat = fs.statSync(filepath)
                return {
                    id: f,
                    name: f,
                    size: stat.size,
                    modDate: stat.mtime,
                    isDir: stat.isDirectory(),
                    isHidden: is_hidden_file(f),
                }
            })
        })
    }

    get_file_contents(filepath: string): Promise<Uint8Array> {
        return fs.promises.readFile(path.join(this.id.directory, filepath))
    }

    async set_file_contents(filepath: string, contents: Uint8Array): Promise<void | string> {
        return fs.promises
            .writeFile(path.join(this.id.directory, filepath), contents)
            .then(() => this.push_project_update())
    }
}

// --------- Initialize ---------
update_projects_cache()
