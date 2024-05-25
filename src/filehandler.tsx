import path from 'path'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import * as fs from 'fs'
import type { Dirent } from 'fs'

const baseurl = new URL('https://git.overleaf.com/')

/**
 * The Project class, exposing functions relating to the handling of projects on the filesystem and git.
 */
export class Project {
    id: string

    /**
     * Creates an instance of Project.
     *
     * @param id - the id hash of the project
     */
    constructor(id: string) {
        if (!this.id_exists(id)) {
            this.import_project()
        }
        this.id = id
    }

    /**
     * Gets the directory where all projects reside.
     *
     * @returns absolute path
     */
    private get_projects_dir(): string {
        return path.join(process.cwd(), 'projects')
    }

    /**
     * Gets the directory of this project.
     *
     * @returns absolute path
     */
    private get_project_dir(): string {
        return path.join(this.get_projects_dir(), this.id)
    }

    /**
     * Gets a list of all project IDs
     *
     * @returns list of strings
     */
    private get_projects_list(): string[] {
        return fs
            .readdirSync(this.get_projects_dir(), { withFileTypes: true })
            .filter((dir_ent: Dirent) => dir_ent.isDirectory())
            .map((dir_ent: Dirent) => dir_ent.name)
    }

    /**
     * Checks whether the project ID exists locally.
     *
     * @param id - the project ID to check
     * @returns boolean, whether the project ID exists locally.
     */
    private id_exists(id: string): boolean {
        return this.get_projects_list().indexOf(id) > -1
    }

    /**
     * Gets the URL to the remote repository this project belongs to.
     *
     * @returns URL
     */
    private get_project_url(): URL {
        return new URL(this.id, baseurl)
    }

    /**
     * Clones the project locally.
     *
     */
    async import_project() {
        git.clone({
            fs,
            http,
            dir: this.get_project_dir(),
            url: this.get_project_url().toString(),
        }).then(console.log)
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
    delete_project() {
        // git.
    }
}
