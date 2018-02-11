import React, { Component } from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, NavLink, Route, Switch} from 'react-router-dom'
import TitleBar from 'react-window-titlebar'
import { remote } from 'electron'
require('./styles/main.sass')

//components imports
import SideNav from './components/SideNav/SideNav.jsx'
import HomeContent from './components/HomeContent/HomeContent.jsx'
import DownloadsPage from './components/DownloadsPage/DownloadsContainer.jsx'
import WatchPage from './components/WatchPage/WatchContainer.jsx'
import SearchPage from './components/SearchPage/SearchContainer.jsx'
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
					</Switch>
				</div>
			</Router>
		)
	}
}
