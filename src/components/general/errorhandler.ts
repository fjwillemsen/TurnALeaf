import { notifications } from '@mantine/notifications'

function showError(title: string, message: string) {
    notifications.show({
        title: title,
        message: message,
        color: 'red',
        autoClose: false,
        withBorder: true,
    })
}

export function handleIPCError(e: Error) {
    const regexp = /Error invoking remote method '(.*)': ([a-zA-Z]*): (.*)/gm
    const groups = [...e.message.matchAll(regexp)]
    const method_name = groups.map((m) => m[1])[0]
    const errortype = groups.map((m) => m[2])[0]
    const errormessage = groups.map((m) => m[3])[0]
    showError(`${errortype} in ${method_name}`, errormessage)
}
