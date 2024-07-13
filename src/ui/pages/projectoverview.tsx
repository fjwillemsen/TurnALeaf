import { Popover, Button } from '@mantine/core'
import { useEffect } from 'react'

import ProjectCreate from '@components/project/create'
import ProjectsList from '@components/project/projectslist'

export default function ProjectOverview() {
    useEffect(() => {
        window.padding()
    })
    return (
        <>
            <Popover width={300} trapFocus position='bottom' withArrow shadow='md'>
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
