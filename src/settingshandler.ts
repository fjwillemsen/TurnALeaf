import { AbstractSettings } from '../shared/settings'

export class Settings extends AbstractSettings {
    get onboarded(): boolean {
        return window.settings.get_onboarded()
    }
    set onboarded(b: boolean) {
        window.settings.set_onboarded(b)
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
