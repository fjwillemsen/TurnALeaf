import { useContext } from 'react'
import { Badge, Center, Tabs, rem } from '@mantine/core'
import { IconFile, IconX } from '@tabler/icons-react'
import { ProjectFilesContext, ProjectOpenedFileContext } from '@/pages/project'
import Writer from '@/components/editor/writer'

export default function FileViewer() {
    const [openFiles, setOpenFiles] = useContext(ProjectFilesContext)
    const [openedFile, setOpenedFile] = useContext(ProjectOpenedFileContext)

    const iconStyle = { width: rem(12), height: rem(12) }

    async function handleChangeTab(tabname: string) {
        await setOpenedFile!(tabname)
    }

    async function handleCloseTab(tabname: string) {
        openFiles.delete(tabname)
        await setOpenFiles!(openFiles)
        if (openedFile == tabname) {
            const nexttab =
                openFiles.size > 0 ? [...openFiles][openFiles.size - 1] : ''
            if (openFiles.has(nexttab)) {
                await handleChangeTab(nexttab)
            }
        }
    }

    return (
        <>
            {openFiles.size > 0 && (
                <Tabs
                    value={openedFile}
                    style={{ height: '100%', width: '100%' }}
                >
                    <Tabs.List>
                        {Array.from(openFiles).map((filepath) => {
                            return (
                                <Tabs.Tab
                                    value={filepath}
                                    key={filepath}
                                    leftSection={<IconFile style={iconStyle} />}
                                    onClick={() => handleChangeTab(filepath)}
                                    rightSection={
                                        openFiles.size > 1 && (
                                            <IconX
                                                style={iconStyle}
                                                onClick={() =>
                                                    handleCloseTab(filepath)
                                                }
                                            />
                                        )
                                    }
                                >
                                    {filepath}
                                </Tabs.Tab>
                            )
                        })}
                    </Tabs.List>

                    {Array.from(openFiles).map((filepath) => {
                        return (
                            <Tabs.Panel
                                value={filepath}
                                key={filepath}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <Writer filepath={filepath} />
                            </Tabs.Panel>
                        )
                    })}
                </Tabs>
            )}
            {openFiles.size == 0 && (
                <Center>
                    <Badge>Select a file to get started</Badge>
                </Center>
            )}
        </>
    )
}
