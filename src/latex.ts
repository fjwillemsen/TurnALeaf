import { PdfTeXEngine, XeTeXEngine, DvipdfmxEngine } from 'swiftlatex'
let engineLoaded: string = ''
let engine: typeof PdfTeXEngine | typeof XeTeXEngine = undefined
let engine_dvi: typeof DvipdfmxEngine = undefined

export type LaTeXOpts = {
    cmd: 'pdflatex' | 'xelatex'
    bufferInputs?: [string, Buffer][]
    inputs?: string[]
    fonts?: string[]
    mainFile?: string | undefined
}

function getEngine(engine: string) {
    switch (engine) {
        case 'pdflatex': {
            return new PdfTeXEngine()
        }
        case 'xelatex': {
            return new XeTeXEngine()
        }
    }
}

export default async function latex(opts: LaTeXOpts) {
    // (re)load the engine if not yet loaded
    const engineUsed = opts.cmd
    if (engineLoaded !== engineUsed) {
        engine = getEngine(engineUsed)
        await engine.loadEngine()
        if (engineUsed == 'xelatex') {
            engine_dvi = new DvipdfmxEngine()
            await engine_dvi.loadEngine()
        }
        await engine.makeMemFSFolder('fonts/')
        engineLoaded = engineUsed
    }

    // load the required fonts
    const fonts = await resolveAssets(opts.fonts || [])
    for (const [name, content] of fonts) {
        await engine.writeMemFSFile(`fonts/${name}`, content)
    }

    // load the required inputs
    const inputs = await resolveAssets(opts.inputs || [])
    for (const [name, content] of inputs) {
        await engine.writeMemFSFile(name, content)
    }

    // load the required files
    const bufferInputs =
        opts.bufferInputs !== undefined ? opts.bufferInputs : []
    for (const [name, content] of bufferInputs) {
        console.log('writing ', name)
        await engine.writeMemFSFile(name, content)
    }

    // set the main file
    const mainFile = opts.mainFile !== undefined ? opts.mainFile : 'main.tex'
    await engine.setEngineMainFile(mainFile)

    // compile to a PDF and return the result as a PDF blob
    switch (engineUsed) {
        case 'pdflatex': {
            const { pdf } = await engine.compileLaTeX()
            return URL.createObjectURL(
                new Blob([pdf], { type: 'application/pdf' })
            )
        }
        case 'xelatex': {
            // compile to an intermediate format
            const res = await engine.compileLaTeX()
            // compile the intermediate result to PDF
            await engine_dvi.writeMemFSFile('main.xdv', res.pdf)
            await engine_dvi.setEngineMainFile('main.xdv')
            const { pdf } = await engine_dvi.compilePDF()
            return URL.createObjectURL(
                new Blob([pdf], { type: 'application/pdf' })
            )
        }
    }
}

async function resolveAssets(urls: string[]) {
    const assets = await Promise.all(
        urls.map((url) =>
            fetch(url)
                .then((res) => res.arrayBuffer())
                .then((buffer) => new Uint8Array(buffer))
        )
    )
    const basenames = urls.map(basename)
    return zip(basenames, assets)
}

function basename(url: string) {
    return url.split('/').pop()
}

function zip<T, U>(a: T[], b: U[]): [T, U][] {
    return a.map((k, i) => [k, b[i]])
}
