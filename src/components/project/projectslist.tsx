import { get_project_names } from '@/projecthandler'

function list_of_projects() {
    const project_names = get_project_names()
    console.log(project_names)
    return project_names.map((projectname) => <li>{projectname}</li>)
}

export default function ProjectsList() {
    return (
        <div>
            <ul>{list_of_projects()}</ul>
        </div>
    )
}
