import { useContext, useEffect, useRef } from 'react'
import { handleIPCError } from '../general/errorhandler'
import { ProjectContext, ProjectFilesContext } from '@/pages/project'
import { Editor } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

export default function Writer() {
    const project = useContext(ProjectContext)
    const [openFiles] = useContext(ProjectFilesContext)
    const editorRef = useRef(
        null
    ) as React.MutableRefObject<null | monaco.editor.IStandaloneCodeEditor>
    const autosaveDelaySeconds = 30 // the time to wait between automatically saving the new contents in seconds
    let lastSaveTime: Date | undefined

    useEffect(() => {
        console.log('useEffect')
        console.log(openFiles)
    }, [openFiles])

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor
        project!
            .get_file_contents(openFiles[0])
            .then((c) => {
                lastSaveTime = new Date()
                editor.getModel()?.setValue(c[0]!.name)
            })
            .catch(handleIPCError)
    }

    function handleEditorChange(value: string | undefined) {
        const currentTime = new Date()
        if (
            lastSaveTime !== undefined &&
            (currentTime.getTime() - lastSaveTime.getTime()) / 1000 >
                autosaveDelaySeconds
        ) {
            lastSaveTime = currentTime
            console.log(value)
            // project.set_file_contents(value)
        }
    }

    return (
        <Editor
            height="100%"
            defaultValue=""
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
        />
    )
}
