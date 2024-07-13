import { ipcMain } from 'electron'

import { get_project, get_project_names, create_project, ProjectID } from '../project'

export const registerProjectIpc = () => {
    // ProjectID API
    ipcMain.handle('projectid:make_hash', (_, url: string) => {
        return new ProjectID(new URL(url)).hash
    })
    ipcMain.handle('projectid:exists_locally', (_, url: string) => {
        return new ProjectID(new URL(url)).exists_locally()
    })
    ipcMain.handle('projectid:get_project_dir', (_, url: string) => {
        return new ProjectID(new URL(url)).directory
    })

    // Project API
    ipcMain.handle('project:hash_to_url', (_, hash: string) => {
        return get_project(hash)?.id.url.toString()
    })
    ipcMain.handle('project:create', (_, url: string, overwrite: boolean) => {
        return create_project(url, overwrite)
    })
    ipcMain.handle('project:get_names', get_project_names)
    ipcMain.handle('project:get_name', (_, hash: string) => {
        return get_project(hash)?.name
    })
    ipcMain.handle('project:set_name', (_, hash: string, name: string) => {
        const project = get_project(hash)
        if (project !== undefined) {
            project.name = name
        }
    })
    ipcMain.handle('project:get_update', (_, hash: string) => {
        return get_project(hash)?.get_project_update()
    })
    ipcMain.handle('project:push_update', (_, hash: string) => {
        return get_project(hash)?.push_project_update()
    })
    ipcMain.handle('project:delete', (_, hash: string) => {
        return get_project(hash)?.delete_project()
    })
    ipcMain.handle('project:get_files', (_, hash: string) => {
        return get_project(hash)?.get_files()
    })
    ipcMain.handle('project:get_file_contents', (_, hash: string, filepath: string) => {
        return get_project(hash)?.get_file_contents(filepath)
    })
    ipcMain.handle('project:set_file_contents', (_, hash: string, filepath: string, contents: Uint8Array) => {
        return get_project(hash)?.set_file_contents(filepath, contents)
    })
}
