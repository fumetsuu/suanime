import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import App from './App.jsx';
import store from './store.js'

var eStore = require('electron-store')
global.estore = new eStore()

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);