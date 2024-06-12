import { useEffect, useState } from 'react'
import { FullFileBrowser, FileArray } from '@aperturerobotics/chonky'
import { ChonkyIconFA } from '@aperturerobotics/chonky-icon-fontawesome'
import { handleIPCError } from '../general/errorhandler'
import { get_project } from '@/projecthandler'

interface FileBrowserProps {
    projecthash: string
}

export default function FileBrowser({ projecthash }: FileBrowserProps) {
    const [projectFiles, setProjectFiles] = useState<FileArray>([null])

    async function get_files(): Promise<void> {
        await get_project(projecthash).then((p) => {
            p.get_files()
                .then((files) => setProjectFiles(files))
                .catch(handleIPCError)
        })
    }

    useEffect(() => {
        get_files()
    }, [])

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
