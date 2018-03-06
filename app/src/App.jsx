import React, { Component } from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, NavLink, Route, Switch} from 'react-router-dom'
import TitleBar from 'react-window-titlebar'
import { remote } from 'electron'
require('./styles/main.sass')

//components imports
import SideNav from './components/SideNav/SideNav.jsx'
// import HomeContent from './components/HomeContent/HomeContent.jsx'
// import DownloadsPage from './components/DownloadsPage/DownloadsContainer.jsx'
// import WatchPage from './components/WatchPage/WatchContainer.jsx'
// import SearchPage from './components/SearchPage/SearchContainer.jsx'
// import InfoPage from './components/InfoPage/InfoContainer.jsx'
// import IntegrationPage from './components/IntegrationPage/IntegrationContainer.jsx'

import { HomeContent, DownloadsPage, WatchPage, SearchPage, InfoPage, IntegrationPage, SettingsPage } from './routes.js'
export default class App extends Component {
	render() {
		return (
			<Router>
				<div className="wrapper">
					<TitleBar remote={remote} theme="dark" actionsPos="right" className="title-bar"/>		
					<SideNav/>
					<Switch>
						<Route exact path="/" component={HomeContent}/>
						<Route path="/downloads" component={DownloadsPage}/>
						<Route path="/watch" component={WatchPage}/>
						<Route path="/search" component={SearchPage}/>
						<Route path="/info" component={InfoPage}/>
						<Route path="/integration" component={IntegrationPage}/>
						<Route path="/settings" component={SettingsPage}/>
					</Switch>
				</div>
			</Router>
		)
	}
}
