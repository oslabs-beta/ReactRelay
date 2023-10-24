import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { parseAllServerFiles } from './controllers/serverASTController.js';
import { parseAllComponents, getCode } from './controllers/componentController.js';
import { getArrayOfFilePaths } from './controllers/fsController.js';

let server;

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
 
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

// ipcMain creates a communication channel between main and renderer --> looks for events regarding dialog
// async in order to wait for the user to select the filepath
ipcMain.handle('dialog', async (_, method, params) => {
  const result = await dialog[method](params)
  return result;
})


ipcMain.handle('code', async (e, args) => {
  try {
    let res = { locals: {componentCode: ''} };

    await getCode(e, args, res)

    return { status: 200, data: res.locals.componentCode }
  } catch (err) {
    console.error(err)
    return { status: 500, error: "Error in ipcMain handler of 'code' route"}
  }
})

ipcMain.handle('components', async (e, args) => {
  try {
    let res = { locals: {components: ''} };
    await getArrayOfFilePaths(e, args, res);
    await parseAllComponents(e, args, res);
    return { status: 201, data: res.locals.components }
  } catch (err) {
    console.error(err)
    return { status: 500, error: "Error in ipcMain handler of 'code' route"}
  }
})

ipcMain.handle('server', async (e, args) => {
  try {
    let res = { locals: {serverRoutes: ''} };
    await getArrayOfFilePaths(e, args, res);
    await parseAllServerFiles(e, args, res);
    return { status: 201, data: res.locals.serverRoutes }
  } catch (err) {
    console.error(err)
    return { status: 500, error: "Error in ipcMain handler of 'code' route"}
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    server.close();
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
