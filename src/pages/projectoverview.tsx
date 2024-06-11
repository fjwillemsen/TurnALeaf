import ProjectsList from '@/components/project/projectslist'
import ProjectCreate from '@/components/project/create'
import { Popover, Button } from '@mantine/core'
import { useEffect } from 'react'

export default function ProjectOverview() {
    useEffect(() => {
        window.padding()
    })
    return (
        <>
            <Popover
                width={300}
                trapFocus
                position="bottom"
                withArrow
                shadow="md"
            >
                <Popover.Target>
                    <Button>Import project</Button>
                </Popover.Target>
                <Popover.Dropdown>
                    <ProjectCreate></ProjectCreate>
                </Popover.Dropdown>
            </Popover>
            <ProjectsList />
        </>
    )
}
