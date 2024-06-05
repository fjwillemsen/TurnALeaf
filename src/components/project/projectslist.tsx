import { get_project_names } from '@/projecthandler'
import { handleIPCError } from '../general/errorhandler'
import { useEffect, useState } from 'react'
import { List, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

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
