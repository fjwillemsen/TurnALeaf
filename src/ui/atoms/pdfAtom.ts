import { atom } from 'jotai'

export interface pdf {
    url: string
    isLoading: boolean
    isError: boolean
}

export const pdfAtom = atom({
    url: '',
    isLoading: false,
    isError: false,
})

pdfAtom.debugLabel = 'pdfAtom'
