import React, { Component } from 'react'
import { render } from 'react-dom'

require('./styles/main.sass')

//components imports
import SideNav from './components/SideNav/SideNav.jsx'
export default class App extends Component {
	render() {
		return (
			<div className="wrapper">
				<SideNav/>
			</div>
		)
	}
}
