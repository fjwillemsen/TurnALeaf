// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { setChonkyDefaults } from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
import MainPage from './pages/main'

setChonkyDefaults({ iconComponent: ChonkyIconFA })

export default function App() {
    return (
        <MantineProvider>
            <Notifications />
            <ModalsProvider>
                <MainPage />
            </ModalsProvider>
        </MantineProvider>
    )
}
