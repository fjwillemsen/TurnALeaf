import { Stepper, Button, Group } from '@mantine/core'
import { hasLength, isEmail } from '@mantine/form'
import { ContextModalProps } from '@mantine/modals'
import { useEffect, useState } from 'react'

import {
    GitAuthorDetailsFormProvider,
    GitTokenOverleafFormProvider,
    useGitAuthorDetailsForm,
    useGitTokenOverleafForm,
} from '@components/settings/formcontext'
import { GitTokenOverleaf, GitAuthorDetails } from '@components/settings/settings'
import { Settings } from '@ui/settingshandler'

const settings = new Settings()

export const OnboardingModal = ({
    context,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    innerProps,
}: ContextModalProps<{ modalBody: string }>) => {
    const [active, setActive] = useState(0)
    const [currentFormValid, setCurrentFormValid] = useState(false)
    const [highestStepVisited, setHighestStepVisited] = useState(active)
    const numSteps = 2

    const formGitTokenOverleaf = useGitTokenOverleafForm({
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        initialValues: {
            token: '',
        },

        validate: {
            token: hasLength({ min: 2, max: 500 }),
        },

        onValuesChange() {
            setCurrentFormValid(formGitTokenOverleaf.isValid())
        },
    })
    function onSubmitGitTokenOverleaf() {
        settings.git_token_overleaf = formGitTokenOverleaf.getValues().token
    }

    const formGitAuthorDetails = useGitAuthorDetailsForm({
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        initialValues: {
            name: '',
            email: '',
        },

        validate: {
            name: hasLength({ min: 2 }),
            email: isEmail('Invalid email address'),
        },

        onValuesChange() {
            setCurrentFormValid(formGitAuthorDetails.isValid())
        },
    })
    async function onSubmitGitAuthorDetails() {
        const values = formGitAuthorDetails.getValues()
        settings.git_author_name = values.name
        settings.git_author_email = values.email
    }

    // mapping of step number to submission handlers
    const formsSubmitter = new Map<number, () => void>()
    formsSubmitter.set(0, onSubmitGitTokenOverleaf)
    formsSubmitter.set(1, onSubmitGitAuthorDetails)

    // retrieve the original values from the backend, if any
    useEffect(() => {
        const retrieve_values = async () => {
            const git_author_name = await settings.git_author_name
            const git_author_email = await settings.git_author_email
            if (git_author_name !== undefined && git_author_name.length > 0) {
                formGitAuthorDetails.setFieldValue('name', git_author_name)
            }
            if (git_author_email !== undefined && git_author_email.length > 0) {
                formGitAuthorDetails.setFieldValue('email', git_author_email)
            }
        }
        retrieve_values()
    }, [])

    /**
     * Handler function called when the stepper buttons are clicked.
     *
     * @param number - nextStep
     */
    const handleStepChange = (nextStep: number, submit = false) => {
        const isOutOfBounds = nextStep > numSteps || nextStep < 0

        // if the step has a form, submit the values
        if (submit && formsSubmitter.has(active)) {
            const submit = formsSubmitter.get(active)!
            submit()
        }

        // close the modal if max steps reached
        if (nextStep > numSteps) {
            settings.onboarded = true
            context.closeAll()
            return
        }

        // set the new active step
        if (isOutOfBounds) {
            return
        }
        setActive(nextStep)
        setHighestStepVisited((hSC) => Math.max(hSC, nextStep))
    }

    // Allow the user to freely go back and forth between visited steps.
    const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step

    return (
        <>
            <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step
                    label='First step'
                    description='Overleaf authentication'
                    allowStepSelect={shouldAllowSelectStep(0)}
                >
                    <GitTokenOverleafFormProvider form={formGitTokenOverleaf}>
                        <GitTokenOverleaf />
                    </GitTokenOverleafFormProvider>
                </Stepper.Step>
                <Stepper.Step
                    label='Second step'
                    description='Set Git commit author details'
                    allowStepSelect={shouldAllowSelectStep(1)}
                >
                    <GitAuthorDetailsFormProvider form={formGitAuthorDetails}>
                        <GitAuthorDetails />
                    </GitAuthorDetailsFormProvider>
                </Stepper.Step>

                <Stepper.Completed>Done, welcome to TurnALeaf!</Stepper.Completed>
            </Stepper>

            <Group justify='center' mt='xl'>
                {active > 0 && (
                    <Button variant='default' disabled={active <= 0} onClick={() => handleStepChange(active - 1)}>
                        Back
                    </Button>
                )}
                <Button disabled={currentFormValid == false} onClick={() => handleStepChange(active + 1, true)}>
                    {active < numSteps ? 'Next step' : 'Finish'}
                </Button>
            </Group>
        </>
    )
}
