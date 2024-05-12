// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { readFile } from "original-fs"


const { contextBridge, ipcRenderer } = require('electron/renderer')


// use https://stackoverflow.com/questions/45148110/how-to-add-a-callback-to-ipc-renderer-send/62630044#62630044
// ok so this exposes it in the renderer window, from node.js
// dont use in renderer.ts directly as node.js needs to be enabled.
// args in link above.
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  readFile: patha => ipcRenderer.invoke('file:readFile', patha),
  readPath: patha => ipcRenderer.invoke('file:readPath', patha)

})