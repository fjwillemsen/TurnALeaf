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

    useEffect(() => {
        console.log('useEffect')
        console.log(openFiles)
    }, [openFiles])

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor
        project!
            .get_file_contents(openFiles[0])
            .then((c) => editor.getModel()?.setValue(c))
            .catch(handleIPCError)
    }

    function handleEditorChange(value: string | undefined) {
        console.log(value)
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
