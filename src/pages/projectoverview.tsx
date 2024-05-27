import { Project, get_projects_list } from '@/filehandler'

function list_of_projects() {
    return get_projects_list().map((project) => <li>{project}</li>)
}

export default function ProjectOverview() {
    return (
        <div>
            <button>Add project</button>
            <ul>{list_of_projects()}</ul>
        </div>
    )
}
