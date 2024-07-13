import { MantineColor, parseThemeColor, useMantineTheme } from '@mantine/core'
import convert from 'color-convert'

export interface LogoProps extends React.ComponentPropsWithoutRef<'img'> {
    color?: MantineColor
    size?: number | string
    shadow?: boolean
}

// function

export function useLogoColors({ color, shadow }: LogoProps) {
    const theme = useMantineTheme()
    const parsedColor = parseThemeColor({ color: color || 'blue', theme })
    const mainColor = parsedColor.isThemeColor ? theme.colors[parsedColor.color][5] : color

    // calculate relative to logo dominant color
    const hsl = convert.hex.hsl('#62a676')
    const hue_offset = 360 - hsl[0]
    const color_to_rotate = (c: string) => Math.abs((hue_offset + convert.hex.hsl(c)[0]) % 360)
    const rotate_value = mainColor == undefined ? '' : `hue-rotate(${color_to_rotate(mainColor)}deg)`
    const shadow_value = shadow ? 'drop-shadow(-1px 2px 2px #222)' : ''

    return {
        background: theme.white,
        textcolor: mainColor,
        filtervalue: `${rotate_value} ${shadow_value}`,
    }
}
