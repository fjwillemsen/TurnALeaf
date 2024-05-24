const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");
import type { Dirent } from "fs";

const baseurl = new URL("https://git.overleaf.com/");

export class Project {
    id: string;

    constructor(id: string) {
        if (!this.id_exists(id)) {
            this.import_project();
        }
        this.id = id;
    }

    private get_projects_dir(): string {
        return path.join(process.cwd(), "projects");
    }

    private get_project_dir(): string {
        return path.join(this.get_projects_dir(), this.id);
    }

    private get_projects_list(): string[] {
        return fs
            .readdirSync(this.get_projects_dir(), { withFileTypes: true })
            .filter((dir_ent: Dirent) => dir_ent.isDirectory())
            .map((dir_ent: Dirent) => dir_ent.name);
    }

    private id_exists(id: string): boolean {
        return this.get_projects_list().indexOf(id) > -1;
    }

    private get_project_url(): URL {
        return new URL(this.id, baseurl);
    }

    async import_project() {
        const dir = this.get_project_dir();
        git.clone({ fs, http, dir, url: this.get_project_url().toString() }).then(console.log);
    }

    async get_project_update() {
        // git.fetch({ fs, http });
    }

    async push_project_update() {
        // git.commit();
    }

    delete_project() {
        // git.
    }
}
