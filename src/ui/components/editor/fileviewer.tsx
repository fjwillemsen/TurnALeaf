import { Badge, Center, Tabs, rem } from '@mantine/core'
import { IconFile, IconX } from '@tabler/icons-react'
import { useContext, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

import Writer, { SaveFileHandle } from '@components/editor/writer'
import { ProjectFilesContext, ProjectOpenedFileContext } from '@ui/pages/project'

export type SaveFilesHandle = {
    saveFiles: () => Promise<void>
}

const FileViewer = forwardRef<SaveFilesHandle>((_: unknown, ref) => {
    const iconStyle = { width: rem(12), height: rem(12) }
    const [openFiles, setOpenFiles] = useContext(ProjectFilesContext)
    const [openedFile, setOpenedFile] = useContext(ProjectOpenedFileContext)
    const writersRef = useRef(new Map<string, SaveFileHandle | null>())

    // Manages calls by outside references.
    useImperativeHandle(ref, () => ({
        async saveFiles() {
            await Promise.all(
                Array.from(openFiles).map((filepath) => {
                    return writersRef.current.get(filepath)?.saveFile()
                }),
            )
        },
    }))

    // listen for changes to openFiles, if a new file is opened add an empty reference
    useEffect(() => {
        openFiles.forEach((filepath) => {
            if (writersRef.current.has(filepath) == false) {
                writersRef.current.set(filepath, null)
            }
        })
    }, [openFiles])

    /**
     * Handler function called when the active tab is changed.
     *
     * @param string - the tabname to switch to.
     */
    async function handleChangeTab(tabname: string) {
        await setOpenedFile!(tabname)
    }

    /**
     * Handler function called when a tab is closed.
     *
     * @param string - the name of the closed tab.
     */
    async function handleCloseTab(tabname: string) {
        // save the opened file
        await writersRef.current.get(tabname)?.saveFile()
        // remove from references
        writersRef.current.delete(tabname)
        openFiles.delete(tabname)
        await setOpenFiles!(openFiles)
        // change the tab if the closed tab is the current tab
        if (openedFile == tabname) {
            const nexttab = openFiles.size > 0 ? [...openFiles][openFiles.size - 1] : ''
            if (openFiles.has(nexttab)) {
                await handleChangeTab(nexttab)
            }
        }
    }

    return (
        <>
            {openFiles.size > 0 && (
                <Tabs value={openedFile} style={{ height: '100%', width: '100%' }}>
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
                                            <IconX style={iconStyle} onClick={() => handleCloseTab(filepath)} />
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
                            <Tabs.Panel value={filepath} key={filepath} style={{ height: '100%', width: '100%' }}>
                                <Writer
                                    filepath={filepath}
                                    ref={(el: SaveFileHandle) => writersRef.current.set(filepath, el)}
                                />
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
})
export default FileViewer
