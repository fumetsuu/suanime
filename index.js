const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path')
const { autoUpdater } = require('electron-updater')

var eStore = require('electron-store')
global.estore = new eStore()

if(process.mainModule.filename.indexOf('app.asar') === -1) {
    require('electron-debug')()
    require('electron-reload')(path.join(__dirname, '/build/'))
}

let mainWindow
let start = Date.now()

app.on('ready', () => {
    mainWindow = new BrowserWindow({ frame: false, width: global.estore.get('initWidth') || 1280, height: global.estore.get('initHeight') || 720, show: false, webPreferences: {
        webSecurity: false
    } })
    mainWindow.setTitle('suanime')
    mainWindow.setMenu(null)
    mainWindow.loadURL('file://'+__dirname+'/build/index.html')
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
        console.log((Date.now()-start), 'ms')
    })
    mainWindow.on('close', () => {
        global.estore.set('initWidth', mainWindow.getSize()[0])
        global.estore.set('initHeight', mainWindow.getSize()[1])
        mainWindow = null
    })
})

app.on('window-all-closed', app.quit)

function sendStatusToWindow(text) {
    mainWindow.webContents.send('download-status', text)
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow({ status: 0, message: 'Checking for update...' })
})

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow({ status: 1, message: 'Update available.' })
})

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow({ status: 2, message: 'Update not available.' })
})

autoUpdater.on('error', (err) => {
    sendStatusToWindow({ status: 3, message: 'Update error.', err})
})

autoUpdater.on('download-progress', (progressObj) => {
    sendStatusToWindow({ status: 4, message: 'Downloading', progressObj})
})

autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow({ status: 5, message: 'Update downloaded! Changes will take effect on restart.'})
    autoUpdater.quitAndInstall()
})

app.on('ready', function() {
    autoUpdater.checkForUpdatesAndNotify()
})