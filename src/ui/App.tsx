// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import '@mantine/notifications/styles.css'
import { Notifications } from '@mantine/notifications'
import { useState, createContext } from 'react'

import { OnboardingModal } from '@ui/modals/onboarding'
import MainPage from '@ui/pages/main'
import { Settings } from '@ui/settingshandler'

const modals = {
    onboarding: OnboardingModal,
}
declare module '@mantine/modals' {
    export interface MantineModalsOverride {
        modals: typeof modals
    }
}

// single Settings instance for React frontend
// by creating one settings instance for the UI and putting it in a context, we can use the hooks to re-render UI on setting changes
const settingsinstance = new Settings()
export const SettingsContext = createContext<[Settings, React.Dispatch<React.SetStateAction<Settings>> | undefined]>([
    settingsinstance,
    undefined,
])

export default function App() {
    const [settings, setSettings] = useState(settingsinstance)
    return (
        <SettingsContext.Provider value={[settings, setSettings]}>
            <MantineProvider>
                <Notifications />
                <ModalsProvider modals={modals}>
                    <MainPage />
                </ModalsProvider>
            </MantineProvider>
        </SettingsContext.Provider>
    )
}
