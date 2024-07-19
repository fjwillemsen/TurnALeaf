import { AppShell, Burger, Group, NavLink, Skeleton, ActionIcon, Tooltip, Space } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { openContextModal } from '@mantine/modals'
import { IconArrowNarrowDown, IconArrowMergeBoth } from '@tabler/icons-react'
import { useEffect, useState, createContext, useContext } from 'react'

import { Logo } from '@components/logo/logo'
import { SettingsContext } from '@ui/App'
import AppRouter from '@ui/router'

export class StatusbarButtonState {
    display: boolean
    loading: boolean
    icon: string
    callback: () => void

    constructor(display = false, loading = false, icon = 'down', callback = () => {}) {
        this.display = display
        this.loading = loading
        this.icon = icon.toLowerCase()
        this.callback = callback
    }

    get_label_tooltip(): string {
        switch (this.icon) {
            case 'down':
                return 'Apply changes from online'
            case 'merge':
                return 'Merge changes with online'
            default:
                throw new Error('Invalid icon value')
        }
    }
}

export const StatusbarContext = createContext({ statusButtonUpdate: [] })

export default function MainPage() {
    const [settings] = useContext(SettingsContext)
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false)
    const [appPadding, setAppPadding] = useState('md')

    // statusbar buttons
    const [buttonUpdate, setButtonUpdate] = useState(new StatusbarButtonState())

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
            header={{ height: 40 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding={appPadding}
        >
            <AppShell.Header>
                <Group gap='xl' grow>
                    <Group px='md'>
                        <Space w='xl' />
                        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' />
                        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom='sm' />
                        <Logo size={30} type='mark' shadow={true} />
                    </Group>
                    <Group px='md' justify='flex-end'>
                        {buttonUpdate.display && (
                            <Tooltip label={buttonUpdate.get_label_tooltip()}>
                                <ActionIcon
                                    loading={buttonUpdate.loading}
                                    disabled={buttonUpdate.loading}
                                    onClick={buttonUpdate.callback}
                                >
                                    {buttonUpdate.icon == 'down' && <IconArrowNarrowDown />}
                                    {buttonUpdate.icon == 'merge' && (
                                        <IconArrowMergeBoth style={{ transform: 'rotate(180deg)' }} />
                                    )}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
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
                <StatusbarContext.Provider
                    value={{
                        statusButtonUpdate: [buttonUpdate, setButtonUpdate],
                    }}
                >
                    <AppRouter></AppRouter>
                </StatusbarContext.Provider>
            </AppShell.Main>
        </AppShell>
    )
}
