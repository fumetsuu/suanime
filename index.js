const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const path = require('path')
require('electron-debug')()
const { autoUpdater } = require('electron-updater')
autoUpdater.autoDownload = false

var eStore = require('electron-store')
global.estore = new eStore()

if(process.mainModule.filename.indexOf('app.asar') === -1) {
    require('electron-reload')(path.join(__dirname, '/build/'))
}

let mainWindow
app.on('ready', () => {
    mainWindow = new BrowserWindow({ frame: false, width: global.estore.get('initWidth') || 1280, height: global.estore.get('initHeight') || 720, show: false, webPreferences: {
        webSecurity: false
    } })
    mainWindow.setTitle('suanime')
    mainWindow.setMenu(null)
    mainWindow.loadURL('file://'+__dirname+'/build/index.html')
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
        if(global.estore.get('auto-update')) {
            autoUpdater.checkForUpdatesAndNotify()
        }
    })
    mainWindow.on('close', () => {
        global.estore.set('initWidth', mainWindow.getSize()[0])
        global.estore.set('initHeight', mainWindow.getSize()[1])
        mainWindow = null
    })
})

app.on('window-all-closed', app.quit)

function sendStatusToWindow(text) {
    mainWindow.webContents.send('update-status', text)
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow({ status: 0, message: 'Checking for updates...' })
})

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow({ status: 1, message: 'Update available. Click to download.' })
})

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow({ status: 2, message: 'suanime is up to date!' })
})

autoUpdater.on('error', (err) => {
    sendStatusToWindow({ status: 3, message: 'Update error.', err})
})

autoUpdater.on('download-progress', (progressObj) => {
    sendStatusToWindow({ status: 4, message: 'Downloading', progressObj})
})

autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow({ status: 5, message: 'Update downloaded! Click to restart and install.'})
})

ipcMain.on('update-check-request', e => {
    autoUpdater.checkForUpdates()
})

ipcMain.on('download-update', e => {
    autoUpdater.downloadUpdate()
})

ipcMain.on('restart-and-install', e => {
    autoUpdater.quitAndInstall(true, true)
})