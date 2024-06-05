// Pre-build script to generate the icons and place them in the correct directories
// const icongen = require('icon-gen')
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { existsSync, mkdirSync, rmSync, statSync, renameSync } from 'fs'
import icongen from 'icon-gen'
import { Buffer } from 'buffer'

// input options
const icongen_options = {
    report: true,
    ico: {
        name: 'icon',
        sizes: [16, 24, 32, 48, 64, 128, 256],
    },
    icns: {
        name: 'icon',
        sizes: [16, 32, 64, 128, 256, 512, 1024],
    },
    favicon: {
        name: 'favicon',
        pngSizes: [],
        icoSizes: [256],
    },
}

// get the unique sizes to generate
const sizes = Array.from(
    new Set(
        Array.from(icongen_options['ico']['sizes']).concat(
            icongen_options['icns']['sizes']
                .concat(icongen_options['favicon']['pngSizes'])
                .concat(icongen_options['favicon']['icoSizes'])
        )
    )
)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function get_radius_mask(size) {
    const radius = Math.round(size / 6.4) // 1:6.4 for Apple as per https://stackoverflow.com/a/3813969
    return Buffer.from(
        `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" /></svg>`
    )
}

async function generate_png_sizes(
    input_file,
    output_folder,
    apply_radius = false
) {
    await sizes.forEach((size) => {
        let i = sharp(input_file).resize(size, size)
        if (apply_radius) {
            i = i.composite([
                {
                    input: get_radius_mask(size),
                    blend: 'dest-in',
                },
            ])
        }
        i.toFile(join(output_folder, `${size}.png`))
    })
}

async function generate_image_formats(input_folder, output_folder) {
    await icongen(input_folder, output_folder, icongen_options)
        .then((results) => {
            console.log(results)
        })
        .catch((err) => {
            console.error(err)
        })
}

async function generate_icons(always_run = true) {
    // set the paths
    const __filename = fileURLToPath(import.meta.url)
    const icon_src_path = resolve(
        join(__filename, '../../assets/logo/current/logo_rounded.png')
    )
    const icon_sizes_folder = resolve(
        join(__filename, '../../assets/logo/sized')
    )
    const build_out_path = resolve(join(__filename, '../../build'))
    const icon_out_path = resolve(join(__filename, '../../public/icon.png'))
    const favicon_out_path = resolve(
        join(__filename, '../../public/favicon.ico')
    )

    // check if the logo file has been modified after the last build
    if (
        always_run == false &&
        existsSync(favicon_out_path) &&
        new Date(statSync(icon_src_path).mtime) <
            new Date(statSync(favicon_out_path).mtime)
    ) {
        console.warn(
            'Logo file not modified since last build, skipping regeneration of icons'
        )
        return
    }

    // remove the intermediate sizes folder and make again
    if (existsSync(icon_sizes_folder) == true) {
        rmSync(icon_sizes_folder, { recursive: true, force: true })
    }
    mkdirSync(icon_sizes_folder)

    // generate the PNG sizes
    await generate_png_sizes(icon_src_path, icon_sizes_folder)
    // wait for 2 seconds to make sure all images are available (terrible solution)
    await delay(2000)

    // generate the icons formats from the PNG
    await generate_image_formats(icon_sizes_folder, icon_sizes_folder)

    // move the icons to their destination
    renameSync(
        join(icon_sizes_folder, 'icon.icns'),
        join(build_out_path, 'icon.icns')
    )
    renameSync(
        join(icon_sizes_folder, 'icon.ico'),
        join(build_out_path, 'icon.ico')
    )
    renameSync(
        join(icon_sizes_folder, '256.png'),
        join(build_out_path, 'icon.png')
    )
    renameSync(join(icon_sizes_folder, 'favicon.ico'), favicon_out_path)
    renameSync(icon_src_path, icon_out_path)
}

generate_icons()
