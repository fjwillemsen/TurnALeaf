import { get_project_names } from '@/filehandler'

function list_of_projects() {
    return get_project_names().map((project) => <li>{project}</li>)
}

export default function ProjectOverview() {
    return (
        <div>
            <button>Add project</button>
            <ul>{list_of_projects()}</ul>
        </div>
    )
}
