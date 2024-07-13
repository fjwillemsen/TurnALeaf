// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import '@mantine/notifications/styles.css'
import { Notifications } from '@mantine/notifications'

import { OnboardingModal } from '@ui/modals/onboarding'
import MainPage from '@ui/pages/main'

const modals = {
    onboarding: OnboardingModal,
}
declare module '@mantine/modals' {
    export interface MantineModalsOverride {
        modals: typeof modals
    }
}

export default function App() {
    return (
        <MantineProvider>
            <Notifications />
            <ModalsProvider modals={modals}>
                <MainPage />
            </ModalsProvider>
        </MantineProvider>
    )
}