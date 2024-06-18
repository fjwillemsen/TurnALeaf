import { useContext, useRef, forwardRef, useImperativeHandle } from 'react'
import { handleIPCError } from '../general/errorhandler'
import { ProjectContext } from '@/pages/project'
import { Editor } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

interface WriterProps {
    filepath: string
}

const Writer = forwardRef(({ filepath }: WriterProps, ref) => {
    const project = useContext(ProjectContext)
    const decoder = new TextDecoder('utf-8')
    const encoder = new TextEncoder()
    const editorRef = useRef(
        null
    ) as React.MutableRefObject<null | monaco.editor.IStandaloneCodeEditor>
    const autosaveDelaySeconds = 30 // TODO make setting | the time to wait between automatically saving the new contents in seconds
    let lastSaveTime: Date | undefined
    let awaitingSaving = false

    useImperativeHandle(ref, () => ({
        async saveFile() {
            console.log('saving ', filepath)
            await saveContents()
        },
    }))

    async function saveContents(value?: string) {
        if (value == undefined) {
            value = editorRef.current?.getValue()
        }
        awaitingSaving = true
        await project?.set_file_contents(filepath, encoder.encode(value))
        awaitingSaving = false
    }

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor
        project!
            .get_file_contents(filepath)
            .then((c) => {
                editor.getModel()?.setValue(decoder.decode(c))
            })
            .catch(handleIPCError)
    }

    function handleEditorChange(value: string | undefined) {
        const currentTime = new Date()
        if (
            awaitingSaving == false &&
            (lastSaveTime == undefined ||
                (currentTime.getTime() - lastSaveTime.getTime()) / 1000 >
                    autosaveDelaySeconds)
        ) {
            lastSaveTime = currentTime
            saveContents(value)
        }
    }

    return (
        <Editor
            defaultValue=""
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
        />
    )
})
export default Writer
