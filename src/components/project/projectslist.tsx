import { get_project_names } from '@/projecthandler'
import { useEffect, useState } from 'react'

export default function ProjectsList() {
    const [projectsList, setProjectsList] = useState<string[]>([])

    useEffect(() => {
        get_project_names().then((names) => setProjectsList(names))
    }, [])

    return (
        <div>
            <ul>
                {projectsList.map((name: string) => (
                    <li>{name}</li>
                ))}
            </ul>
        </div>
    )
}
