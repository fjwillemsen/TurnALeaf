import { ipcRenderer, contextBridge } from 'electron'
import {
    get_project,
    get_project_names,
    create_project,
    ProjectID,
} from '../main/project'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) =>
            listener(event, ...args)
        )
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },

    // You can expose other APTs you need here.
    // ...
})

// --------- Expose Settings API to the Renderer process ---------
contextBridge.exposeInMainWorld('settings', {
    get_onboarded: () => ipcRenderer.invoke('settings:get_onboarded'),
    set_onboarded: (b: boolean) =>
        ipcRenderer.invoke('settings:set_onboarded', b),
    get_git_token_overleaf: () =>
        ipcRenderer.invoke('settings:get_git_token_overleaf'),
    set_git_token_overleaf: (token: string) =>
        ipcRenderer.invoke('settings:set_git_token_overleaf', token),
    delete_git_token_overleaf: () =>
        ipcRenderer.invoke('settings:delete_git_token_overleaf'),
})

// --------- Expose ProjectID API to the Renderer process ---------
contextBridge.exposeInMainWorld('projectID', {
    makeHash: (url: URL) => {
        return new ProjectID(url).hash
    },
    existsLocally: (url: URL) => {
        return new ProjectID(url).exists_locally()
    },
    getProjectDir: (url: URL) => {
        return new ProjectID(url).get_project_dir()
    },
})

// --------- Expose Project API to the Renderer process ---------
contextBridge.exposeInMainWorld('project', {
    create: create_project,
    getNames: get_project_names,
    getName: (hash: string) => {
        return get_project(hash)?.name
    },
    setName: (hash: string, name: string) => {
        const project = get_project(hash)
        if (project !== undefined) {
            project.name = name
        }
    },
    getUpdate: (hash: string) => {
        return get_project(hash)?.get_project_update()
    },
    pushUpdate: (hash: string) => {
        return get_project(hash)?.push_project_update()
    },
    delete: (hash: string) => {
        return get_project(hash)?.delete_project()
    },
})

// --------- Preload scripts loading ---------
function domReady(
    condition: DocumentReadyState[] = ['complete', 'interactive']
) {
    return new Promise((resolve) => {
        if (condition.includes(document.readyState)) {
            resolve(true)
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true)
                }
            })
        }
    })
}

const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find((e) => e === child)) {
            return parent.appendChild(child)
        }
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find((e) => e === child)) {
            return parent.removeChild(child)
        }
    },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
    const className = `loaders-css__square-spin`
    const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
    const oStyle = document.createElement('style')
    const oDiv = document.createElement('div')

    oStyle.id = 'app-loading-style'
    oStyle.innerHTML = styleContent
    oDiv.className = 'app-loading-wrap'
    oDiv.innerHTML = `<div class="${className}"><div></div></div>`

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle)
            safeDOM.append(document.body, oDiv)
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle)
            safeDOM.remove(document.body, oDiv)
        },
    }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
    ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
