const electron = require('electron')
const { app, BrowserWindow } = electron

require('electron-debug')({ showDevTools: true })

require('electron-reload')(__dirname, {
    ignored: /downloads\/|node_modules\/|app\/build\/|mal-cache\//
});

let mainWindow

app.on('ready', () => {
    let mainWindow = new BrowserWindow({ frame: false, width: 800, height: 600,
    webPreferences: {
        directWrite: false
    } })
    mainWindow.setTitle('suanime')
    mainWindow.setMenu(null)
    mainWindow.loadURL('file://'+__dirname+'/app/index.html')
})