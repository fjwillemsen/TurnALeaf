import { get_project_names } from '@/projecthandler'

function list_of_projects() {
    return get_project_names().map((projectname) => <li>{projectname}</li>)
}

export default function ProjectsList() {
    return (
        <div>
            <ul>{list_of_projects()}</ul>
        </div>
    )
}
