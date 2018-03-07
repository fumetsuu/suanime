const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path')
const { autoUpdater } = require('electron-updater')

if(process.mainModule.filename.indexOf('app.asar') === -1) {
    require('electron-debug')()
    require('electron-reload')(path.join(__dirname, '/build/'))
}

let mainWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({ frame: false, width: 1280, height: 720, show: false, webPreferences: {
        webSecurity: false
    } })
    mainWindow.webContents.openDevTools()
    mainWindow.setTitle('suanime')
    mainWindow.setMenu(null)
    mainWindow.loadURL('file://'+__dirname+'/build/index.html')
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })
    mainWindow.on('close', () => {
        mainWindow = null
    })
})

app.on('window-all-closed', app.quit)

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.')
})

autoUpdater.on('error', (err) => {
    sendStatusToWindow('Update error.'+err)
})

autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded!!!!!.')
    autoUpdater.quitAndInstall()
})

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
    sendStatusToWindow(log_message)
})
function sendStatusToWindow(text) {
    mainWindow.webContents.send('message', text)
}

app.on('ready', function() {
    autoUpdater.checkForUpdatesAndNotify()
})