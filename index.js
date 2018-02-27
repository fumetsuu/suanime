const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path')

require('electron-debug')()

require('electron-reload')(path.join(__dirname, '/app/build/'))

let mainWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({ frame: false, width: 1280, height: 720, show: false })
    mainWindow.setTitle('suanime')
    mainWindow.setMenu(null)
    mainWindow.loadURL('file://'+__dirname+'/app/build/index.html')
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })
    mainWindow.on('close', () => {
        mainWindow = null
    })
})