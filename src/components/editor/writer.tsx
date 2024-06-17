import { useContext, useRef } from 'react'
import { handleIPCError } from '../general/errorhandler'
import { ProjectContext } from '@/pages/project'
import { Editor } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

interface WriterProps {
    filepath: string
}

export default function Writer({ filepath }: WriterProps) {
    const project = useContext(ProjectContext)
    const editorRef = useRef(
        null
    ) as React.MutableRefObject<null | monaco.editor.IStandaloneCodeEditor>
    const autosaveDelaySeconds = 30 // the time to wait between automatically saving the new contents in seconds
    let lastSaveTime: Date | undefined

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor
        const decoder = new TextDecoder('utf-8')
        project!
            .get_file_contents(filepath)
            .then((c) => {
                lastSaveTime = new Date()
                editor.getModel()?.setValue(decoder.decode(c))
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
            defaultValue=""
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
        />
    )
}
