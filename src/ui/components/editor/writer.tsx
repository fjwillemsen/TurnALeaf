import { Editor } from '@monaco-editor/react'
import type monaco from 'monaco-editor'
import { useContext, useRef, forwardRef, useImperativeHandle } from 'react'

import { handleIPCError } from '@components/general/errorhandler'
import { ProjectContext } from '@ui/pages/project'

interface WriterProps {
    filepath: string
}

export type SaveFileHandle = {
    saveFile: () => Promise<void>
    refreshFile: () => Promise<void>
}

const Writer = forwardRef<SaveFileHandle, WriterProps>(({ filepath }: WriterProps, ref) => {
    const project = useContext(ProjectContext)
    const decoder = new TextDecoder('utf-8')
    const encoder = new TextEncoder()
    const editorRef = useRef(null) as React.MutableRefObject<null | monaco.editor.IStandaloneCodeEditor>
    const autosaveDelaySeconds = 30 // TODO make setting | the time to wait between automatically saving the new contents in seconds
    let lastSaveTime: Date | undefined
    let executing_save = false
    let executing_refresh = false

    // Manages calls by outside references.
    useImperativeHandle(ref, () => ({
        async saveFile() {
            console.log('saving ', filepath)
            await saveContents()
        },
        async refreshFile() {
            console.log('refreshing ', filepath)
            await refreshContents()
        },
    }))

    /**
     * Save the contents to the file on disk.
     *
     * @param string - optional: the contents to save. If not passed, the contents of the current editor are used.
     */
    async function saveContents(value?: string) {
        if (value == undefined) {
            value = editorRef.current?.getValue()
        }
        executing_save = true
        await project?.set_file_contents(filepath, encoder.encode(value)).catch(handleIPCError)
        executing_save = false
    }

    /**
     * Refreshes the editor with the contents on disk.
     *
     * @returns void
     */
    async function refreshContents() {
        executing_refresh = true
        project!
            .get_file_contents(filepath)
            .then((c) => {
                editorRef.current.getModel()?.setValue(decoder.decode(c))
                executing_refresh = false
            })
            .catch(handleIPCError)
    }

    /**
     * Handler function called when mounted, retrieves the file contents from disk.
     *
     * @param IStandaloneCodeEditor - the editor.
     */
    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor
        refreshContents()
    }

    /**
     * Handler function called when an edit is made by the user.
     *
     * @param string - the new contents.
     */
    function handleEditorChange(value: string | undefined) {
        const currentTime = new Date()
        if (
            executing_save == false &&
            executing_refresh == false &&
            (lastSaveTime == undefined ||
                (currentTime.getTime() - lastSaveTime.getTime()) / 1000 > autosaveDelaySeconds)
        ) {
            lastSaveTime = currentTime
            saveContents(value)
        }
    }

    return <Editor defaultValue='' onMount={handleEditorDidMount} onChange={handleEditorChange} />
})
export default Writer
