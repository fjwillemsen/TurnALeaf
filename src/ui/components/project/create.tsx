import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

import { handleIPCError } from '@components/general/errorhandler'
import { create_project } from '@ui/projecthandler'

/**
 * Function to check whether a string is a valid HTTP URL
 *
 * @param string - string_to_check
 * @returns boolean - true if valid
 */
function isValidHttpUrl(string_to_check: string) {
    try {
        const url = new URL(string_to_check)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (_) {
        return false
    }
}

export default function ProjectCreate() {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            url: 'https://git@git.overleaf.com/62db1e7ff06c89dcd3887b38', // TODO remove
        },

        validate: {
            url: (value) => (isValidHttpUrl(value) ? null : 'Invalid git URL'),
        },
    })

    const handleSubmit = (values: typeof form.values) => {
        create_project(new URL(values.url), true).catch(handleIPCError)
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                withAsterisk
                label='URL to the git repository'
                placeholder='https://git.overleaf.com/62...e8'
                key={form.key('url')}
                {...form.getInputProps('url')}
            />

            <Group justify='flex-end' mt='md'>
                <Button type='submit'>Submit</Button>
            </Group>
        </form>
    )
}
