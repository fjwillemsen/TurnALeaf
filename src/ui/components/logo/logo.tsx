// Based on https://github.com/mantinedev/mantine/tree/8bdabaf0df23e08d0256c001fe9d1c554195ff3c/packages/%40mantinex/mantine-logo/src/MantineLogo

import { LogoRounded } from './logorounded'
import { LogoText } from './logotext'
import { LogoProps } from './use-logo-colors'

export interface SpecLogoProps extends LogoProps {
    type?: 'mark' | 'full'
}

export function Logo({ type, ...others }: SpecLogoProps) {
    if (type === 'mark') {
        return <LogoRounded {...others} />
    }

    return <LogoText {...others} />
}
