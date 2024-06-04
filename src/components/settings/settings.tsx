import { Settings } from '@/settingshandler'
import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

const settings = new Settings()

export function GitTokenOverleaf() {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            token: '',
        },

        validate: {
            token: (value) =>
                100 >= value.length && value.length > 5
                    ? null
                    : 'Invalid token',
        },
    })

    const handleSubmit = (values: typeof form.values) => {
        settings.git_token_overleaf = values.token
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                withAsterisk
                label="Overleaf git authentication token"
                placeholder="olp_9F...hA"
                key={form.key('token')}
                {...form.getInputProps('token')}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    )
}
