import { useState, createRef, useRef, RefObject, useEffect, createContext } from 'react'
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useParams } from 'react-router-dom'

import FileViewer, { SaveFilesHandle } from '@components/editor/fileviewer'
import Preview from '@components/editor/preview'
import FileBrowser from '@components/filebrowser/filebrowser'
import { handleIPCError } from '@components/general/errorhandler'
import { Project, get_project } from '@ui/projecthandler'

import styles from './project.module.css'

const panelRefs: RefObject<ImperativePanelHandle>[] = new Array(3).fill(null).map(() => createRef())

function PanelResizeCollapseHandle({
    collapsePanel,
    right = false,
    className = '',
}: {
    collapsePanel: number
    right?: boolean
    className?: string
    id?: string
}) {
    const [isright, setIsRight] = useState(right)
    const handleClick = () => {
        const panel = panelRefs[collapsePanel].current
        if (panel == null) {
            console.error('Panel reference not defined')
        } else {
            setIsRight(right ? panel.isCollapsed : panel.isExpanded)
            if (panel.isExpanded()) {
                panel.collapse()
            } else {
                panel.expand()
            }
        }
    }
    return (
        <PanelResizeHandle className={[styles.ResizeHandleOuter, className].join(' ')} onClick={handleClick}>
            <div className={styles.ResizeHandleInner}>
                <svg
                    className={styles.Icon}
                    style={{
                        transform: isright ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    viewBox='0 0 32 32'
                >
                    <path
                        fill='currentColor'
                        d='M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z'
                    />
                </svg>
            </div>
        </PanelResizeHandle>
    )
}

export const ProjectContext = createContext<Project | undefined>(undefined)
export const ProjectFilesContext = createContext<
    [Set<string>, React.Dispatch<React.SetStateAction<Set<string>>> | undefined]
>([new Set(), undefined])
export const ProjectOpenedFileContext = createContext<
    [string, React.Dispatch<React.SetStateAction<string>> | undefined]
>(['main.tex', undefined])

export default function ProjectPage() {
    const { hash } = useParams()
    const [project, setProject] = useState<Project>()
    const [openFiles, setOpenFiles] = useState<Set<string>>(new Set())
    const [openedFile, setOpenedFile] = useState<string>('main.tex')
    const fileviewerRef = useRef<SaveFilesHandle>(null)

    const saveFilesMethod = () => {
        return fileviewerRef.current!.saveFiles()
    }

    useEffect(() => {
        window.padding('0')
        get_project(hash!)
            .then((p) => setProject(p))
            .catch(handleIPCError)
    }, [])

    return (
        <PanelGroup
            autoSaveId='ProjectPagePanels'
            direction='horizontal'
            style={{
                position: 'fixed',
            }}
        >
            <Panel
                ref={panelRefs[0]}
                order={1}
                defaultSize={20}
                collapsible={true}
                minSize={2}
                style={{ height: '100%' }}
            >
                <div key='files' style={{ border: '1px solid black', height: '100%' }}>
                    {project !== undefined && (
                        <ProjectContext.Provider value={project}>
                            <ProjectFilesContext.Provider value={[openFiles, setOpenFiles]}>
                                <ProjectOpenedFileContext.Provider value={[openedFile, setOpenedFile]}>
                                    <FileBrowser />
                                </ProjectOpenedFileContext.Provider>
                            </ProjectFilesContext.Provider>
                        </ProjectContext.Provider>
                    )}
                </div>
            </Panel>
            <PanelResizeCollapseHandle collapsePanel={0} />
            <Panel ref={panelRefs[1]} order={2} defaultSize={40} collapsible={false} minSize={2}>
                <div key='editor' style={{ border: '1px solid black', height: '100%' }}>
                    {project !== undefined && (
                        <ProjectContext.Provider value={project}>
                            <ProjectFilesContext.Provider value={[openFiles, setOpenFiles]}>
                                <ProjectOpenedFileContext.Provider value={[openedFile, setOpenedFile]}>
                                    <FileViewer ref={fileviewerRef} />
                                </ProjectOpenedFileContext.Provider>
                            </ProjectFilesContext.Provider>
                        </ProjectContext.Provider>
                    )}
                </div>
            </Panel>
            <PanelResizeCollapseHandle collapsePanel={2} right={true} />
            <Panel ref={panelRefs[2]} order={3} defaultSize={40} collapsible={true} minSize={2}>
                <div key='pdf' style={{ border: '1px solid black', height: '100%' }}>
                    {project !== undefined && (
                        <ProjectContext.Provider value={project}>
                            <Preview saveFilesMethod={saveFilesMethod} />
                        </ProjectContext.Provider>
                    )}
                </div>
            </Panel>
        </PanelGroup>
    )
}
