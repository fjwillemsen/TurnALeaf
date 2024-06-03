/**
 * The Settings class, exposing functions relating to user settings. Has a secure compartment.
 *
 */
export abstract class AbstractSettings {
    abstract get onboarded(): boolean

    abstract set onboarded(b: boolean)

    abstract get git_token_overleaf(): string

    abstract set git_token_overleaf(token: string)

    /**
     * Deletes the Overleaf git authentication token from the store.
     *
     */
    abstract git_token_overleaf_delete(): void
}
