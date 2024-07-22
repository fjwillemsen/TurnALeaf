import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

import { ProjectIDChannels, ProjectChannels } from '@channels/projectChannels'
import { SettingsChannels } from '@channels/settingsChannels'

const versions: Record<string, unknown> = {}

// Process versions
for (const type of ['chrome', 'node', 'electron']) {
    versions[type] = process.versions[type]
}

function validateIPC(channel: string) {
    if (!channel) {
        throw new Error(`Unsupported event IPC channel '${channel}'`)
    }

    return true
}

export type RendererListener = (event: IpcRendererEvent, ...args: any[]) => void

export const globals = {
    /** Processes versions **/
    versions,

    /**
     * A minimal set of methods exposed from Electron's `ipcRenderer`
     * to support communication to main process.
     */
    ipcRenderer: {
        send(channel: string, ...args: Parameters<typeof ipcRenderer.send>) {
            if (validateIPC(channel)) {
                ipcRenderer.send(channel, ...args)
            }
        },

        invoke(channel: string, ...args: Parameters<typeof ipcRenderer.invoke>) {
            if (validateIPC(channel)) {
                return ipcRenderer.invoke(channel, ...args)
            }
        },

        on(channel: string, listener: RendererListener) {
            if (validateIPC(channel)) {
                ipcRenderer.on(channel, listener)

                return this
            }
        },

        once(channel: string, listener: RendererListener) {
            if (validateIPC(channel)) {
                ipcRenderer.once(channel, listener)

                return this
            }
        },

        removeListener(channel: string, listener: RendererListener) {
            if (validateIPC(channel)) {
                ipcRenderer.removeListener(channel, listener)

                return this
            }
        },
    },
}

/** Create a safe, bidirectional, synchronous bridge across isolated contexts
 *  When contextIsolation is enabled in your webPreferences, your preload scripts run in an "Isolated World".
 */
contextBridge.exposeInMainWorld('electron', globals)

// --------- Expose Settings API to the Renderer process ---------
contextBridge.exposeInMainWorld('settings', {
    get_onboarded: () => ipcRenderer.invoke(SettingsChannels.GET_ONBOARDED),
    set_onboarded: (b: boolean) => ipcRenderer.invoke(SettingsChannels.SET_ONBOARDED, b),
    get_git_author_name: () => ipcRenderer.invoke(SettingsChannels.GET_GIT_AUTHOR_NAME),
    set_git_author_name: (name: string) => ipcRenderer.invoke(SettingsChannels.SET_GIT_AUTHOR_NAME, name),
    get_git_author_email: () => ipcRenderer.invoke(SettingsChannels.GET_GIT_AUTHOR_EMAIL),
    set_git_author_email: (name: string) => ipcRenderer.invoke(SettingsChannels.SET_GIT_AUTHOR_EMAIL, name),
    get_git_token_overleaf: () => ipcRenderer.invoke(SettingsChannels.GET_GIT_TOKEN_OVERLEAF),
    set_git_token_overleaf: (token: string) => ipcRenderer.invoke(SettingsChannels.SET_GIT_TOKEN_OVERLEAF, token),
    delete_git_token_overleaf: () => ipcRenderer.invoke(SettingsChannels.DELETE_GIT_TOKEN_OVERLEAF),
})

// --------- Expose ProjectID API to the Renderer process ---------
contextBridge.exposeInMainWorld('projectID', {
    makeHash: (url: string) => ipcRenderer.invoke(ProjectIDChannels.MAKE_HASH, url),
    existsLocally: (url: string) => ipcRenderer.invoke(ProjectIDChannels.EXISTS_LOCALLY, url),
    getProjectDir: (url: string) => ipcRenderer.invoke(ProjectIDChannels.GET_PROJECT_DIR, url),
})

// --------- Expose Project API to the Renderer process ---------
contextBridge.exposeInMainWorld('project', {
    hashToURL: (hash: string) => ipcRenderer.invoke(ProjectChannels.HASH_TO_URL, hash),
    create: (url: string, overwrite: boolean) => ipcRenderer.invoke(ProjectChannels.CREATE, url, overwrite),
    getNames: () => ipcRenderer.invoke(ProjectChannels.GET_NAMES),
    getName: (hash: string) => ipcRenderer.invoke(ProjectChannels.GET_NAME, hash),
    setName: (hash: string, name: string) => ipcRenderer.invoke(ProjectChannels.SET_NAME, hash, name),
    getUpdate: (hash: string) => ipcRenderer.invoke(ProjectChannels.GET_UPDATE, hash),
    applyUpdate: (hash: string) => ipcRenderer.invoke(ProjectChannels.APPLY_UPDATE, hash),
    pushUpdate: (hash: string) => ipcRenderer.invoke(ProjectChannels.PUSH_UPDATE, hash),
    delete: (hash: string) => ipcRenderer.invoke(ProjectChannels.DELETE, hash),
    getFiles: (hash: string) => ipcRenderer.invoke(ProjectChannels.GET_FILES, hash),
    getFileContents: (hash: string, filepath: string) =>
        ipcRenderer.invoke(ProjectChannels.GET_FILE_CONTENTS, hash, filepath),
    setFileContents: (hash: string, filepath: string, contents: Uint8Array) =>
        ipcRenderer.invoke(ProjectChannels.SET_FILE_CONTENTS, hash, filepath, contents),
})
