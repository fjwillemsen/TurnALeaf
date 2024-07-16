import { AppShell, Burger, Group, NavLink, Skeleton, ActionIcon, Tooltip, Space } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { openContextModal } from '@mantine/modals'
import { IconArrowNarrowDown, IconArrowMergeBoth } from '@tabler/icons-react'
import { useEffect, useState, createContext } from 'react'

import { Logo } from '@components/logo/logo'
import AppRouter from '@ui/router'
import { Settings } from '@ui/settingshandler'

export class StatusbarButtonState {
    display: boolean
    loading: boolean
    callback: () => void

    constructor(display = false, loading = false, callback = () => {}) {
        this.display = display
        this.loading = loading
        this.callback = callback
    }
}

export const StatusbarContext = createContext({ statusButtonUpdateApply: [], statusButtonUpdateMerge: [] })

export default function MainPage() {
    const settings = new Settings()
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false)
    const [appPadding, setAppPadding] = useState('md')

    // statusbar
    const [buttonUpdateApply, setButtonUpdateApply] = useState(new StatusbarButtonState())
    const [buttonUpdateMerge, setButtonUpdateMerge] = useState(new StatusbarButtonState())

    window.padding = (padding = 'md') => {
        setAppPadding(padding)
    }

    useEffect(() => {
        console.error(`buttonUpdateApply to ${buttonUpdateApply.display}, loading: ${buttonUpdateApply.loading}`)
    }, [buttonUpdateApply])

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
                        {buttonUpdateApply.display && (
                            <Tooltip label='Apply changes from online'>
                                <ActionIcon
                                    loading={buttonUpdateApply.loading}
                                    disabled={buttonUpdateApply.loading}
                                    onClick={buttonUpdateApply.callback}
                                >
                                    <IconArrowNarrowDown />
                                </ActionIcon>
                            </Tooltip>
                        )}
                        {buttonUpdateMerge.display && (
                            <Tooltip label='Merge changes with online'>
                                <ActionIcon
                                    loading={buttonUpdateMerge.loading}
                                    disabled={buttonUpdateMerge.loading}
                                    onClick={buttonUpdateMerge.callback}
                                >
                                    <IconArrowMergeBoth style={{ transform: 'rotate(180deg)' }} />
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
                        statusButtonUpdateApply: [buttonUpdateApply, setButtonUpdateApply],
                        statusButtonUpdateMerge: [buttonUpdateMerge, setButtonUpdateMerge],
                    }}
                >
                    <AppRouter></AppRouter>
                </StatusbarContext.Provider>
            </AppShell.Main>
        </AppShell>
    )
}
