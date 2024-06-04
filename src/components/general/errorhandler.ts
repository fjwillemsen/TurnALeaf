export function handleIPCError(e: Error) {
    const regexp = /Error invoking remote method '(.*)': ([a-zA-Z]*): (.*)/gm
    const groups = [...e.message.matchAll(regexp)]
    const method_name = groups.map((m) => m[1])
    const errortype = groups.map((m) => m[2])
    const errormessage = groups.map((m) => m[3])
    alert(`${errortype}: ${errormessage} (in ${method_name})`)
}
