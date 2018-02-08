const electron = require('electron');
const { app, BrowserWindow } = electron;

require('electron-reload')(__dirname, {
    ignored: /downloads\/|node_modules\/|app\/build\//
});

let mainWindow;

app.on('ready', () => {
    let mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.setTitle('suanime')
    mainWindow.setMenu(null)
    mainWindow.loadURL('file://'+__dirname+'/app/index.html');
});