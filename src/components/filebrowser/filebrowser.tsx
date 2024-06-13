import { useContext, useEffect, useState } from 'react'
import {
    FullFileBrowser,
    FileArray,
    FileActionHandler,
} from '@aperturerobotics/chonky'
import { ChonkyIconFA } from '@aperturerobotics/chonky-icon-fontawesome'
import { handleIPCError } from '../general/errorhandler'
import { ProjectContext, ProjectFilesContext } from '@/pages/project'

export default function FileBrowser() {
    const project = useContext(ProjectContext)
    const [openFiles, setOpenFiles] = useContext(ProjectFilesContext)
    const [projectFiles, setProjectFiles] = useState<FileArray>([null])

    async function get_files(): Promise<void> {
        project!
            .get_files()
            .then((files) => setProjectFiles(files))
            .catch(handleIPCError)
    }

    const handleAction: FileActionHandler = (action) => {
        if (action.id === 'mouse_click_file') {
            // open the file in the editor
            setOpenFiles!(action.state.selectedFiles.map((f) => f.id))
        }
    }

    useEffect(() => {
        get_files()
    }, [project])

    useEffect(() => {
        console.log('useEffect')
        console.log(openFiles)
    }, [openFiles])

    return (
        <FullFileBrowser
            files={projectFiles}
            darkMode={true}
            iconComponent={ChonkyIconFA}
            onFileAction={handleAction}
        />
    )
}
