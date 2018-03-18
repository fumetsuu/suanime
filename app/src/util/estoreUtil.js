const fs = require('fs')
const path = require('path')

import store from '../store.js'
import popura from 'popura'
const pclient = popura()
var eStore = require('electron-store')
global.estore = new eStore()
const tempcwd = require('electron').remote.app.getPath('userData')

const suDownloader = require('../suDownloader/suDownloader')


export function initialiseDB() {
    if(!global.estore.get("sudownloaderSettings")) {
        global.estore.set("sudownloaderSettings", {})
    } //legacy support

    let { maxConcurrentDownloads, autoQueue, autoStart } = global.estore.get("sudownloaderSettings")

    suDownloader.setSettings({ maxConcurrentDownloads, autoQueue, autoStart })

    suDownloader.populateState()

    if(!isInitialised()) {
        global.estore.set('initialised', 'true')
        global.estore.set('storedDownloadsArray', [])
        global.estore.set('storedCompletedArray', [])
        global.estore.set('storedClearedArray', [])
        global.estore.set('storedDownloading', [])
        global.estore.set('storedCompleted', [])
        global.estore.set('sudownloaderSettings', {
            maxConcurrentDownloads: 4,
            autoQueue: true,
            autoStart: true
        })
        global.estore.set('usepagination', false)
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
}

function isInitialised() {
    return global.estore.get('initialiseed')
}





