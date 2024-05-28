import { MantineColor, parseThemeColor, useMantineTheme } from '@mantine/core'

export type LogoVariant = 'mantine.dev' | 'ui.mantine.dev'

export interface LogoProps extends React.ComponentPropsWithoutRef<'svg'> {
    color?: MantineColor
    variant?: LogoVariant
    size?: number | string
    inverted?: boolean
}

export function useLogoColors({ color, inverted }: LogoProps) {
    const theme = useMantineTheme()
    const parsedColor = parseThemeColor({ color: color || 'blue', theme })
    const mainColor = parsedColor.isThemeColor
        ? theme.colors[parsedColor.color][5]
        : color

    return {
        background: inverted ? theme.white : mainColor,
        color: inverted ? mainColor : theme.white,
    }
}
