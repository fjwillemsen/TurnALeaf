import { rem } from '@mantine/core'

import logo from '@assets/icons/icon_nobg.png'

import { LogoProps, useLogoColors } from './use-logo-colors'

export function LogoRounded({ size, color, shadow, style, ...others }: LogoProps) {
    const colors = useLogoColors({ color, shadow })

    return (
        // <div style={{ backgroundColor: colors.background }}>
        <img
            src={logo}
            alt='logo'
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
