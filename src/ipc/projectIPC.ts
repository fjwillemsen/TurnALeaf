import { ipcMain } from 'electron'

import { get_project, get_project_names, create_project, ProjectID } from '@/project'
import { ProjectIDChannels, ProjectChannels } from '@channels/projectChannels'

export const registerProjectIpc = () => {
    // ProjectID API
    ipcMain.handle(ProjectIDChannels.MAKE_HASH, (_, url: string) => {
        return new ProjectID(new URL(url)).hash
    })
    ipcMain.handle(ProjectIDChannels.EXISTS_LOCALLY, (_, url: string) => {
        return new ProjectID(new URL(url)).exists_locally()
    })
    ipcMain.handle(ProjectIDChannels.GET_PROJECT_DIR, (_, url: string) => {
        return new ProjectID(new URL(url)).directory
    })

    // Project API
    ipcMain.handle(ProjectChannels.HASH_TO_URL, (_, hash: string) => {
        return get_project(hash)?.id.url.toString()
    })
    ipcMain.handle(ProjectChannels.CREATE, (_, url: string, overwrite: boolean) => {
        return create_project(url, overwrite)
    })
    ipcMain.handle(ProjectChannels.GET_NAMES, get_project_names)
    ipcMain.handle(ProjectChannels.GET_NAME, (_, hash: string) => {
        return get_project(hash)?.name
    })
    ipcMain.handle(ProjectChannels.SET_NAME, (_, hash: string, name: string) => {
        const project = get_project(hash)
        if (project !== undefined) {
            project.name = name
        }
    })
    ipcMain.handle(ProjectChannels.GET_UPDATE, (_, hash: string) => {
        return get_project(hash)?.get_project_update()
    })
    ipcMain.handle(ProjectChannels.APPLY_UPDATE, (_, hash: string) => {
        return get_project(hash)?.apply_project_update()
    })
    ipcMain.handle(ProjectChannels.PUSH_UPDATE, (_, hash: string) => {
        return get_project(hash)?.push_project_update()
    })
    ipcMain.handle(ProjectChannels.DELETE, (_, hash: string) => {
        return get_project(hash)?.delete_project()
    })
    ipcMain.handle(ProjectChannels.GET_FILES, (_, hash: string) => {
        return get_project(hash)?.get_files()
    })
    ipcMain.handle(ProjectChannels.GET_FILE_CONTENTS, (_, hash: string, filepath: string) => {
        return get_project(hash)?.get_file_contents(filepath)
    })
    ipcMain.handle(ProjectChannels.SET_FILE_CONTENTS, (_, hash: string, filepath: string, contents: Uint8Array) => {
        return get_project(hash)?.set_file_contents(filepath, contents)
    })
}
