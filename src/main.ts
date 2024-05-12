import { app, BrowserWindow } from 'electron';
// import path from 'path';
const {ipcMain, dialog } = require('electron/main')


import * as path from "path";
import * as fs from 'fs';
import { read } from 'original-fs';

let window: BrowserWindow;


async function readPath(patha: string) {
  var filestoreturn: object[] = []
  const files = fs.readdirSync(patha, { withFileTypes: true })
  
  files.forEach(file => {
    filestoreturn.push([file.isDirectory(), file.name])
  })

  return [filestoreturn, patha]
}


async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog(window, {properties: ['openDirectory']})
  // console.log("handleFileOpen", filePaths)

  if (!canceled) {
    return readPath(filePaths[0])
    // use fs.readdir to read the files in the directory



  }
}



async function readFile(patha: string) {
  console.log("readFile path", path)

  const data = fs.readFileSync(patha, 'utf8')
  console.log("readFile data", data)
  return data

  
}


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'customButtonsOnHover',
    trafficLightPosition: { x: 20, y: 18 },
    backgroundColor: '#4f6e53'
  });

  window = mainWindow;

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    console.log('Loading Vite dev server:', MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  // ipcMain.handle('file:readFile', () => readFile())

  ipcMain.handle('file:readFile', async (event, patha) => {
    return readFile(patha)
  })

  ipcMain.handle('file:readPath', async (event, patha) => {
    return readPath(patha)
  })
  
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })



})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
