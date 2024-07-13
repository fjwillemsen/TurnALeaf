import { FullFileBrowser, FileArray, FileActionHandler } from '@aperturerobotics/chonky'
import { ChonkyIconFA } from '@aperturerobotics/chonky-icon-fontawesome'
import { useContext, useEffect, useState } from 'react'

import { handleIPCError } from '@components/general/errorhandler'
import { ProjectContext, ProjectFilesContext, ProjectOpenedFileContext } from '@ui/pages/project'

export default function FileBrowser() {
    const project = useContext(ProjectContext)
    const [projectFiles, setProjectFiles] = useState<FileArray>([null])
    const [openFiles, setOpenFiles] = useContext(ProjectFilesContext)
    const [, setOpenedFile] = useContext(ProjectOpenedFileContext)

    async function get_files(): Promise<void> {
        project!
            .get_files()
            .then((files) => setProjectFiles(files))
            .catch(handleIPCError)
    }

    const handleAction: FileActionHandler = (action) => {
        if (action.id === 'mouse_click_file' && action.payload.file.isDir == false) {
            // open the file in the editor
            const fileid = action.payload.file.id
            setOpenFiles!(new Set(openFiles.add(fileid)))
            setOpenedFile!(fileid)
        }
    }

    useEffect(() => {
        get_files()
    }, [project])

    return (
        <FullFileBrowser
            files={projectFiles}
            darkMode={true}
            iconComponent={ChonkyIconFA}
            onFileAction={handleAction}
        />
    )
}
