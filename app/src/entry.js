import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import App from './App.jsx';
import store from './store.js'
const fs = require('fs')
const path = require('path')

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

if(!fs.existsSync(path.join(__dirname, '../downloads/'))) {
    fs.mkdirSync(path.join(__dirname, '../downloads/'))
}

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);