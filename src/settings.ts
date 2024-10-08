import { safeStorage } from 'electron'

import Store from 'electron-store'

import { AbstractSettings } from '@shared/settings'

const secure_string_encoding = 'latin1'

// --------- Initialize the local storages ---------

type SettingStoreType = {
    onboarded: boolean
    git_commit_author_name: string
    git_commit_author_email: string
}

const settingstore = new Store<SettingStoreType>({
    defaults: {
        onboarded: false,
        git_commit_author_name: '',
        git_commit_author_email: '',
    },
})

type SecureSettingStoreType = {
    git_token_overleaf: string
}
const securesettingstore = new Store<SecureSettingStoreType>()

// --------- Define the Settings class ---------
/**
 * The Settings class, exposing functions relating to user settings. Has a secure compartment.
 *
 */
export class Settings extends AbstractSettings {
    constructor() {
        super()
        if (!safeStorage.isEncryptionAvailable()) {
            throw new Error('Settings: encryption is not available')
        }
    }

    /**
     * Checks whether a secure setting exists.
     *
     * @param SecureSettingStoreType - the key to check
     * @returns boolean - whether a secure key exists
     */
    private has_secure(key: keyof SecureSettingStoreType): boolean {
        return securesettingstore.has(key) && securesettingstore.get(key) != ''
    }

    /**
     * Gets the decrypted value of a securely stored key if it exists.
     *
     * @param SecureSettingStoreType - the key to get
     * @returns string - the decrypted value
     */
    private get_secure(key: keyof SecureSettingStoreType): string {
        if (this.has_secure(key) == false) {
            throw new Error('Settings: requested secure key does not exist')
        }
        const buffer = Buffer.from(securesettingstore.get(key), secure_string_encoding)
        return safeStorage.decryptString(buffer)
    }

    /**
     * Sets the decrypted value of a securely stored key.
     *
     * @param SecureSettingStoreType - the key to set
     * @param string - the value to set
     */
    private set_secure(key: keyof SecureSettingStoreType, value: string) {
        const buffer = safeStorage.encryptString(value)
        securesettingstore.set(key, buffer.toString(secure_string_encoding))
    }

    /**
     * Removes a securely stored key.
     *
     * @param SecureSettingStoreType - the key to remove
     */
    private delete_secure(key: keyof SecureSettingStoreType) {
        securesettingstore.delete(key)
    }

    get onboarded(): boolean {
        return settingstore.get('onboarded')
    }

    set onboarded(b: boolean) {
        settingstore.set('onboarded', b)
    }

    get git_author_name(): string {
        return settingstore.get('git_commit_author_name')
    }

    set git_author_name(name: string) {
        settingstore.set('git_commit_author_name', name)
    }

    get git_author_email(): string {
        return settingstore.get('git_commit_author_email')
    }

    set git_author_email(email: string) {
        settingstore.set('git_commit_author_email', email)
    }

    get git_token_overleaf(): string {
        return this.get_secure('git_token_overleaf')
    }

    set git_token_overleaf(token: string) {
        this.set_secure('git_token_overleaf', token)
    }

    git_token_overleaf_delete() {
        this.delete_secure('git_token_overleaf')
    }
}

// single Settings instance for Electron backend
export const settings = new Settings()
