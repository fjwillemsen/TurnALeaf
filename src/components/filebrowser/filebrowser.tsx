import { useContext, useEffect, useState } from 'react'
import { FullFileBrowser, FileArray } from '@aperturerobotics/chonky'
import { ChonkyIconFA } from '@aperturerobotics/chonky-icon-fontawesome'
import { handleIPCError } from '../general/errorhandler'
import { ProjectContext } from '@/pages/project'

export default function FileBrowser() {
    const project = useContext(ProjectContext)
    const [projectFiles, setProjectFiles] = useState<FileArray>([null])

    async function get_files(): Promise<void> {
        project!
            .get_files()
            .then((files) => setProjectFiles(files))
            .catch(handleIPCError)
    }

    useEffect(() => {
        get_files()
    }, [project])

    // const files: FileArray = [
    //     { id: 'lht', name: 'Projects', isDir: true },
    //     {
    //         id: 'mcd',
    //         name: 'chonky-sphere-v2.png',
    //         thumbnailUrl: 'https://chonky.io/chonky-sphere-v2.png',
    //     },
    // ]
    // const folderChain = [{ id: 'xcv', name: 'Demo', isDir: true }]
    return (
        <FullFileBrowser
            files={projectFiles}
            // folderChain={folderChain}
            darkMode={true}
            iconComponent={ChonkyIconFA}
        />
    )
}
