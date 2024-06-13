import { useContext, useEffect } from 'react'
import { handleIPCError } from '../general/errorhandler'
import { ProjectContext, ProjectFilesContext } from '@/pages/project'

export default function Writer() {
    const [openFiles] = useContext(ProjectFilesContext)

    useEffect(() => {
        console.log('useEffect')
        console.log(openFiles)
    }, [openFiles])

    return <></>
}
