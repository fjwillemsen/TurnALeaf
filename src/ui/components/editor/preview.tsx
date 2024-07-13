import { useAtom } from 'jotai'
import { useContext } from 'react'

import { pdfAtom } from '@ui/atoms/pdfAtom'
import { ProjectContext } from '@ui/pages/project'

import latex, { LaTeXOpts } from '../../latex'

interface PDFViewerInterface {
    url: string
}

const PDFViewer = ({ url }: PDFViewerInterface) => {
    return <iframe title='PDFviewer' src={url} width='100%' height='100%' />
}

interface PreviewInterface {
    saveFilesMethod: () => Promise<void>
}

export default function Preview({ saveFilesMethod }: PreviewInterface) {
    const project = useContext(ProjectContext)
    const [pdf, setPDF] = useAtom(pdfAtom)

    async function generatePDF() {
        await saveFilesMethod()
        const bufferInputs = async () => {
            const files = await project!.get_files().then(async (files) => {
                return files
                    .filter((file) => file?.isDir == false && file.isHidden == false)
                    .map((file) => {
                        return file!.id
                    })
            })
            const buffers: [string, Uint8Array][] = await Promise.all(
                files.map(async (file) => {
                    return [file, await project!.get_file_contents(file)]
                }),
            )
            return buffers
        }
        const opts: LaTeXOpts = {
            cmd: 'pdflatex',
            bufferInputs: await bufferInputs(),
            mainFile: 'main.tex',
        }
        return latex(opts)
    }

    async function renderPDF() {
        setPDF({ ...pdf, isLoading: true })
        try {
            const newPDFUrl = await generatePDF()
            setPDF({ ...pdf, url: newPDFUrl, isLoading: false })
        } catch (error) {
            console.error(error)
            setPDF({ ...pdf, isError: true, isLoading: false })
        }
    }

    return (
        <>
            <button onClick={renderPDF}>Click to compile</button>
            <button onClick={() => window.open(pdf.url)}>export as pdf</button>
            <hr />
            <PDFViewer url={pdf.url} />
        </>
    )
}
