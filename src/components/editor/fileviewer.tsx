import { useContext, useEffect } from 'react'
import { Tabs, rem } from '@mantine/core'
import { IconFile } from '@tabler/icons-react'
import { ProjectFilesContext } from '@/pages/project'
import Writer from '@/components/editor/writer'

export default function FileViewer() {
    const [openFiles] = useContext(ProjectFilesContext)

    useEffect(() => {
        console.log('useEffect')
        console.log(openFiles)
    }, [openFiles])

    const iconStyle = { width: rem(12), height: rem(12) }

    return (
        <Tabs defaultValue="main.tex" style={{ height: '100%', width: '100%' }}>
            <Tabs.List>
                {Array.from(openFiles).map((filepath) => {
                    return (
                        <Tabs.Tab
                            value={filepath}
                            key={filepath}
                            leftSection={<IconFile style={iconStyle} />}
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
