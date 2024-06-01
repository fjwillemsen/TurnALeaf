/// <reference types="vite/client" />

interface Window {
    // expose in the `electron/preload/index.ts`
    ipcRenderer: import('electron').IpcRenderer
    project: import('electron').Project
    projectID: import('electron').ProjectID
}
