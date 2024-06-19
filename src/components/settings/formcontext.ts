// For reference, see https://mantine.dev/form/create-form-context/#store-context-in-separate-file

import { createFormContext } from '@mantine/form'

interface GitTokenOverleafFormValues {
    token: string
}

interface GitAuthorDetailsFormValues {
    name: string
    email: string
}

export const [
    GitTokenOverleafFormProvider,
    useGitTokenOverleafFormContext,
    useGitTokenOverleafForm,
] = createFormContext<GitTokenOverleafFormValues>()

export const [
    GitAuthorDetailsFormProvider,
    useGitAuthorDetailsFormContext,
    useGitAuthorDetailsForm,
] = createFormContext<GitAuthorDetailsFormValues>()
