import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import App from './App.jsx';
import store from './store.js'

var eStore = require('electron-store')
global.estore = new eStore()

console.log(global.estore.get("storedDownloadsArray"))
if(global.estore.get("storedDownloadsArray").length) {
    store.dispatch({
        type: 'HYDRATE_DOWNLOADS',
        payload: {
            downloadsArray: global.estore.get("storedDownloadsArray")
        }
    })
}

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);