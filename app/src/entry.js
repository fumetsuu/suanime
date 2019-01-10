import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './store.js'
import { initialiseDB } from './util/estoreUtil'

import eStore from 'electron-store'
global.estore = new eStore()

initialiseDB()

render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('app')
)