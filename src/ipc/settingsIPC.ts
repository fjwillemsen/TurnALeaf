import { ipcMain } from 'electron'

import { SettingsChannels } from '../channels/settingsChannels'
import { settings } from '../settings'

export const registerSettingsIpc = () => {
    ipcMain.handle(SettingsChannels.GET_ONBOARDED, () => {
        return settings.onboarded
    })
    ipcMain.handle(SettingsChannels.SET_ONBOARDED, (_, b: boolean) => {
        settings.onboarded = b
    })
    ipcMain.handle(SettingsChannels.GET_GIT_AUTHOR_NAME, () => {
        return settings.git_author_name
    })
    ipcMain.handle(SettingsChannels.SET_GIT_AUTHOR_NAME, (_, name: string) => {
        settings.git_author_name = name
    })
    ipcMain.handle(SettingsChannels.GET_GIT_AUTHOR_EMAIL, () => {
        return settings.git_author_email
    })
    ipcMain.handle(SettingsChannels.SET_GIT_AUTHOR_EMAIL, (_, email: string) => {
        settings.git_author_email = email
    })
    ipcMain.handle(SettingsChannels.GET_GIT_TOKEN_OVERLEAF, () => {
        return settings.git_token_overleaf
    })
    ipcMain.handle(SettingsChannels.SET_GIT_TOKEN_OVERLEAF, (_, token: string) => {
        settings.git_token_overleaf = token
    })
    ipcMain.handle(SettingsChannels.DELETE_GIT_TOKEN_OVERLEAF, settings.git_token_overleaf_delete)
}
