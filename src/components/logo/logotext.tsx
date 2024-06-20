import { Group, rem } from '@mantine/core'
import { LogoProps, useLogoColors } from './use-logo-colors'
import { LogoRounded } from './logorounded'

export function LogoText({ size, color, style, shadow, ...others }: LogoProps) {
    const colors = useLogoColors({ color, shadow })

    return (
        <Group>
            <LogoRounded
                color={color}
                size={size / 1.2}
                style={{ ...style }}
                shadow={shadow}
                {...others}
            />
            <p
                style={{
                    color: colors.textcolor,
                    height: rem(size / 1.2),
                    marginLeft: '-20px',
                    fontFamily: 'fantasy',
                    ...style,
                }}
            >
                TurnALeaf
            </p>
        </Group>
    )
}
