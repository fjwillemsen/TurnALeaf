import { AbstractSettings } from '../shared/settings'

export class Settings extends AbstractSettings {
    get onboarded(): boolean {
        return window.settings.get_onboarded()
    }
    set onboarded(b: boolean) {
        window.settings.set_onboarded(b)
    }
    get git_author_name(): string {
        return window.settings.get_get_git_author_name()
    }
    set git_author_name(name: string) {
        window.settings.set_get_git_author_name(name)
    }
    get git_author_email(): string {
        return window.settings.get_get_git_author_email()
    }
    set git_author_email(email: string) {
        window.settings.set_get_git_author_email(email)
    }
    get git_token_overleaf(): string {
        return window.settings.get_git_token_overleaf()
    }
    set git_token_overleaf(token: string) {
        window.settings.set_git_token_overleaf(token)
    }
    git_token_overleaf_delete(): void {
        window.settings.delete_git_token_overleaf()
    }
}
