// const path = window.require('path')
// import path from 'path'
// import * as fs from 'node:fs'
// import Store from 'electron-store'

export function get_project_names(): string[] {
    // console.log(path.join())
    // console.log(fs.Dir)
    // console.log(Store)
    return ['hello', 'world']
}

function list_of_projects() {
    return get_project_names().map((project) => <li>{project}</li>)
}

export default function ProjectsList() {
    return (
        <div>
            <ul>{list_of_projects()}</ul>
        </div>
    )
}
