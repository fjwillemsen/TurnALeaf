import { FullFileBrowser, FileArray } from '@aperturerobotics/chonky'
import { ChonkyIconFA } from '@aperturerobotics/chonky-icon-fontawesome'

export default function FileBrowser() {
    const files: FileArray = [
        { id: 'lht', name: 'Projects', isDir: true },
        {
            id: 'mcd',
            name: 'chonky-sphere-v2.png',
            thumbnailUrl: 'https://chonky.io/chonky-sphere-v2.png',
        },
    ]
    const folderChain = [{ id: 'xcv', name: 'Demo', isDir: true }]
    return (
        <FullFileBrowser
            files={files}
            folderChain={folderChain}
            darkMode={true}
            iconComponent={ChonkyIconFA}
        />
    )
}
