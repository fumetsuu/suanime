import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import App from './App.jsx';
import store from './store.js'
const fs = require('fs')
const path = require('path')
import popura from 'popura'
const pclient = popura()
const tempcwd = require('electron').remote.app.getPath('userData')

var eStore = require('electron-store')
global.estore = new eStore()

if(!global.estore.get('initialised')) {
    global.estore.set('initialised', 'true')
    global.estore.set('storedDownloadsArray', [])
    global.estore.set('storedCompletedArray', [])
    global.estore.set('storedClearedArray', [])
    global.estore.set('storedDownloading', [])
    global.estore.set('storedCompleted', [])
    //storedDownloading and storedCompleted are arrays of only the filenames used to check the status of a download, ALWAYS updates with its corresponding props arrays
    global.estore.set('downloadsPath', path.join(tempcwd, '/downloads/'))
} else {
    store.dispatch({
        type: 'HYDRATE_DOWNLOADS',
        payload: {
            downloadsArray: global.estore.get("storedDownloadsArray"),
            completedArray: global.estore.get("storedCompletedArray"),
            clearedArray: global.estore.get("storedClearedArray"),
            downloading: global.estore.get("storedDownloading"),
            completed: global.estore.get("storedCompleted")
        }
    })
}

if(global.estore.get("listdata") && global.estore.get("listinfo")) {
    store.dispatch({
        type: 'HYDRATE_LIST',
        payload: {
            listdata: global.estore.get("listdata"),
            listinfo: global.estore.get("listinfo")
        }
    })
}

if(global.estore.get("mal")) {
    let { user, pass } = global.estore.get("mal")
    pclient.setUser(user, pass)
    store.dispatch({
        type: 'SET_CLIENT',
        payload: {
            pclient: pclient
        }
    })
}

if(!fs.existsSync(global.estore.get('downloadsPath'))) {
    fs.mkdirSync(global.estore.get('downloadsPath'))
}
if(!fs.existsSync(path.join(tempcwd, '/mal-cache/'))) {
    fs.mkdirSync(path.join(tempcwd, '/mal-cache/'))
}

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);