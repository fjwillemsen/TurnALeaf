import { useContext, useEffect } from 'react'
import { Tabs, rem } from '@mantine/core'
import { IconFile } from '@tabler/icons-react'
import { ProjectFilesContext, ProjectOpenedFileContext } from '@/pages/project'
import Writer from '@/components/editor/writer'

export default function FileViewer() {
    const [openFiles] = useContext(ProjectFilesContext)
    const [openedFile, setOpenedFile] = useContext(ProjectOpenedFileContext)

    useEffect(() => {
        console.log('useEffect')
        console.log(openFiles)
    }, [openFiles])

    const iconStyle = { width: rem(12), height: rem(12) }

    function handleChangeTab(tabname: string) {
        setOpenedFile!(tabname)
    }

    return (
        <Tabs value={openedFile} style={{ height: '100%', width: '100%' }}>
            <Tabs.List>
                {Array.from(openFiles).map((filepath) => {
                    return (
                        <Tabs.Tab
                            value={filepath}
                            key={filepath}
                            leftSection={<IconFile style={iconStyle} />}
                            onClick={() => handleChangeTab(filepath)}
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
    )
}
