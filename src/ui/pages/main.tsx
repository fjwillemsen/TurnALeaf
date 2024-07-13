import { AppShell, Burger, Group, NavLink, Skeleton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { openContextModal } from '@mantine/modals'
import { useEffect, useState } from 'react'

import { Logo } from '@components/logo/logo'
import AppRouter from '@ui/router'
import { Settings } from '@ui/settingshandler'

export default function MainPage() {
    const settings = new Settings()
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false)
    const [appPadding, setAppPadding] = useState('md')

    window.padding = (padding = 'md') => {
        setAppPadding(padding)
    }

    useEffect(() => {
        const fetchOnboarded = async () => {
            if ((await settings.onboarded) == false) {
                await new Promise((r) => setTimeout(r, 1000))

                openContextModal({
                    modal: 'onboarding',
                    title: 'One-time setup',
                    size: 'auto',
                    centered: true,
                    transitionProps: { transition: 'fade', duration: 250 },
                    trapFocus: true,
                    withCloseButton: false,
                    closeOnClickOutside: false,
                    closeOnEscape: false,
                    innerProps: {
                        modalBody: '',
                    },
                })
            }
        }
        fetchOnboarded().catch(console.error)
    }, [])

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding={appPadding}
        >
            <AppShell.Header>
                <Group h='100%' px='md'>
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom='sm' size='sm' />
                    <Logo size={40} type='mark' shadow={true} />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p='md'>
                Settings
                <NavLink></NavLink>
                Projects
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} h={28} mt='sm' animate={false} />
                    ))}
            </AppShell.Navbar>
            <AppShell.Main>
                <AppRouter></AppRouter>
            </AppShell.Main>
        </AppShell>
    )
}
