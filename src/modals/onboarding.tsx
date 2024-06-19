import { Stepper, Button, Group } from '@mantine/core'
import {
    GitTokenOverleaf,
    GitAuthorDetails,
} from '@/components/settings/settings'
import { useState } from 'react'
import { ContextModalProps } from '@mantine/modals'

export const OnboardingModal = ({
    context,
    id,
    innerProps,
}: ContextModalProps<{ modalBody: string }>) => {
    const [active, setActive] = useState(1)
    const [highestStepVisited, setHighestStepVisited] = useState(active)
    const numSteps = 2

    const handleStepChange = (nextStep: number) => {
        const isOutOfBounds = nextStep > numSteps || nextStep < 0

        if (nextStep > numSteps) {
            context.closeContextModal(id)
        }

        if (isOutOfBounds) {
            return
        }

        setActive(nextStep)
        setHighestStepVisited((hSC) => Math.max(hSC, nextStep))
    }

    // Allow the user to freely go back and forth between visited steps.
    const shouldAllowSelectStep = (step: number) =>
        highestStepVisited >= step && active !== step

    return (
        <>
            <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step
                    label="First step"
                    description="Overleaf authentication"
                    allowStepSelect={shouldAllowSelectStep(0)}
                >
                    <GitTokenOverleaf />
                </Stepper.Step>
                <Stepper.Step
                    label="Second step"
                    description="Set Git commit author details"
                    allowStepSelect={shouldAllowSelectStep(1)}
                >
                    <GitAuthorDetails />
                </Stepper.Step>

                <Stepper.Completed>
                    Done, welcome to TurnALeaf!
                </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl">
                <Button
                    variant="default"
                    onClick={() => handleStepChange(active - 1)}
                    disabled={active <= 0}
                >
                    Back
                </Button>
                <Button onClick={() => handleStepChange(active + 1)}>
                    {active < numSteps ? 'Next step' : 'Finish'}
                </Button>
            </Group>
        </>
    )
}
