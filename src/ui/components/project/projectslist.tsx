import { List, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { handleIPCError } from '@components/general/errorhandler'
import { get_project_names } from '@ui/projecthandler'

export default function ProjectsList() {
    const [projectsList, setProjectsList] = useState<[string, string][]>([])

    useEffect(() => {
        get_project_names()
            .then((names) => setProjectsList(names))
            .catch(handleIPCError)
    }, [])

    return (
        <>
            <Text>Projects:</Text>
            <List>
                {projectsList.map(([name, hash]) => (
                    <List.Item key={hash}>
                        <Link to={`/project/${hash}`}>{name}</Link>
                    </List.Item>
                ))}
            </List>
        </>
    )
}
