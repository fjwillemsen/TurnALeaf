import { join } from 'path'
import { rem } from '@mantine/core'
import { LogoProps, useLogoColors } from './use-logo-colors'
// const logo = await import(join(process.resourcesPath, 'logo_nobg.png'))
// import logo from '../../assets/logo_nobg.png'
import logo from 'logo_nobg.png'

export function LogoRounded({
    size,
    color,
    shadow,
    style,
    ...others
}: LogoProps) {
    const colors = useLogoColors({ color, shadow })

    return (
        // <div style={{ backgroundColor: colors.background }}>
        <img
            src={logo}
            alt="logo"
            style={{
                filter: colors.filtervalue,
                width: rem(size),
                height: rem(size),
                ...style,
            }}
            {...others}
        />
    )
}
