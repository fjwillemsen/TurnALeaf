import styled from 'styled-components'
import { useAtom } from 'jotai'
import { lazy } from 'react'
import latex from '../latex'
import { pdfAtom } from '../atoms/pdfAtom'

const Preview = lazy(()=> import('../components/editor/preview'))

const Main = styled.main`
  display: grid;
  grid-template-columns: 0.3fr 0.7fr 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header header header'
    'sidebar form preview';
  height: 100vh;
`

async function generatePDF() {
    const docstring = [
        "\\documentclass[conference]{IEEEtran}",
        "\\begin{document}",
        "Hello world",
        "\\end{document}",
    ].join('\n');
    const opts = {
        cmd: 'xelatex'
    }
    return latex(docstring, opts);
}

export default function MainPage() {
    const [pdf, setPDF] = useAtom(pdfAtom)
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
        <Main>
            <button onClick={renderPDF}>
                Click to compile
            </button>
            <Preview />
        </Main>
    )
}