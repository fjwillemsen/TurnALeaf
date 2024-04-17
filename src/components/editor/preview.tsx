import { useAtom } from 'jotai'
import { useState, useCallback } from 'react'
import { Document, Page } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import styled from 'styled-components'
import { pdfAtom } from '../../atoms/pdfAtom'

import { pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

const Output = styled.output`
  grid-area: preview;
  background: ${(props) => props.theme.lightBlack};
  overflow-y: auto;
  border-left: 1px solid black;
`

const PdfContainer = styled.article`
  width: 100%;
  height: 100%;
`

const PdfDocument = styled(Document)`
  width: 100%;
`

const PdfPage = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5em 0 10rem 0;

  canvas {
    max-width: 95% !important;
    height: auto !important;
  }
`

export default function Preview() {
  const [pdf] = useAtom(pdfAtom)
  const [, setPageCount] = useState(1)
  const [pageNumber] = useState(1)
  const [scale] = useState(document.body.clientWidth > 1440 ? 1.75 : 1)

  const handleDocumentLoadSuccess = useCallback((pdf: PDFDocumentProxy) => {
    setPageCount(pdf.numPages)
  }, [])

  return (
    <Output>
      <button onClick={() => window.open(pdf.url)}>export as pdf</button>
      <hr/>
      <PdfContainer>
        {/* <div>
            <Document file={pdf.url || '/blank.pdf'} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
            </Document>
            <p>
                Page {pageNumber} of {numPages}
            </p>
        </div> */}
        <PdfDocument
          file={pdf.url || '/blank.pdf'}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading=""
        >
          <PdfPage
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading=""
          />
        </PdfDocument>
      </PdfContainer>
    </Output>
  )
}