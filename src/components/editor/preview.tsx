import { useAtom } from 'jotai'
import { useContext } from 'react'

import latex from '../../latex'
import { LaTeXOpts } from '../../latex'
import { pdfAtom } from '../../atoms/pdfAtom'
import { ProjectContext } from '@/pages/project'

interface PDFViewerInterface {
    url: string
}

const PDFViewer = ({ url }: PDFViewerInterface) => {
    return <iframe src={url} width="100%" height="100%" />
}

export default function Preview() {
    const project = useContext(ProjectContext)
    const [pdf, setPDF] = useAtom(pdfAtom)

    async function generatePDF() {
        const docstring = await project?.get_file_contents('main.tex')
        const opts: LaTeXOpts = {
            cmd: 'pdflatex',
            bufferInputs: [
                ['frog.jpg', await project!.get_file_contents('frog.jpg')],
                ['sample.bib', await project!.get_file_contents('sample.bib')],
            ],
        }
        return latex(docstring!, opts)
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
