import React, { Component } from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, NavLink, Route, Switch} from 'react-router-dom'

require('./styles/main.sass')

//components imports
import SideNav from './components/SideNav/SideNav.jsx'
import HomeContent from './components/HomeContent/HomeContent.jsx'
import DownloadsPage from './components/DownloadsPage/DownloadsContainer.jsx'
import WatchPage from './components/WatchPage/WatchContainer.jsx'
export default class App extends Component {
	render() {
		return (
			<Router>
				<div className="wrapper">
					<SideNav/>
					<Switch>
						<Route exact path="/" component={HomeContent}/>
						<Route path="/downloads" component={DownloadsPage}/>
						<Route path="/watch" component={WatchPage}/>
					</Switch>
				</div>
			</Router>
		)
	}
}
