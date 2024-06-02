import ProjectsList from '@/components/project/projectslist'
import ProjectCreate from '@/components/project/create'
import { Popover, Button } from '@mantine/core'

export default function ProjectOverview() {
    return (
        <div>
            <Popover
                width={300}
                trapFocus
                position="bottom"
                withArrow
                shadow="md"
            >
                <Popover.Target>
                    <Button>Add project</Button>
                </Popover.Target>
                <Popover.Dropdown>
                    <ProjectCreate></ProjectCreate>
                </Popover.Dropdown>
            </Popover>
            <ProjectsList />
        </div>
    )
}
