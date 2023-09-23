import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Components, Server } from '../renderer/src/interfaces/stateInterfaces';

type SendData = { id: string; filePath?: never } | { id: never; filePath: string; }

interface ReturnObject {
  status: number;
  data: Components | Server
}

// Custom APIs for renderer
const api = {
  openDialog: (method, config) => ipcRenderer.invoke("dialog", method, config),
  send: (route: string, data: SendData): void | Promise<string | ReturnObject> => {
    let validRoutes = ['components', 'server', 'code'];
    if (validRoutes.includes(route)) return ipcRenderer.invoke(route, data);
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
