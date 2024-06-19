import { Text, TextInput } from '@mantine/core'
import {
    useGitAuthorDetailsFormContext,
    useGitTokenOverleafFormContext,
} from './formcontext'

export function GitTokenOverleaf() {
    const form = useGitTokenOverleafFormContext()

    return (
        <>
            <TextInput
                withAsterisk
                label="Overleaf git authentication token"
                placeholder="olp_9F...hA"
                key={form.key('token')}
                {...form.getInputProps('token')}
            />

            <Text>
                This token is necessary to get your project from Overleaf and to
                make sure changes made in TurnALeaf also appear on Overleaf. Get
                it by going to https://www.overleaf.com/user/settings, scroll
                down to 'Project Synchronisation', and create a token under 'Git
                Integration'.
            </Text>
        </>
    )
}

export function GitAuthorDetails() {
    const form = useGitAuthorDetailsFormContext()

    return (
        <>
            <TextInput
                withAsterisk
                label="Git commit author name"
                placeholder="dr. Turn A. Leaf"
                key={form.key('name')}
                {...form.getInputProps('name')}
            />
            <TextInput
                withAsterisk
                label="Git commit author email"
                placeholder="turn.a@leaf.com"
                key={form.key('email')}
                {...form.getInputProps('email')}
            />

            <Text>
                This information is used to track who made which changes to a
                project, and are exclusively used for this purpose.
            </Text>
        </>
    )
}
