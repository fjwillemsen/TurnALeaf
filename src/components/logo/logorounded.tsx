import { rem } from '@mantine/core'
import { LogoProps, useLogoColors } from './use-logo-colors'
import logo from '../../assets/logo_nobg.png'

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
