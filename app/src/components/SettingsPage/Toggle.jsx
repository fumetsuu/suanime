import React, { Component } from 'react'

export default class Toggle extends Component {
	constructor(props) {
		super(props)
		this.state = {
			toggleOn: this.props.toggleOn
		}
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({
			toggleOn: this.props.toggleOn
		})
	}
	

	render() {
		let { toggleOn } = this.state
		let toggleClass = 'toggle'
		toggleClass+=this.props.className ? ' '+this.props.className : ''
		toggleClass+=toggleOn ? ' toggle-active' : ''
		return (
			<div className={toggleClass} onClick={this.onToggle.bind(this)}>
				{toggleOn ? 'On' : 'Off'}
			</div>
		)
	}

	onToggle() {
		if(this.props.onToggle) this.props.onToggle();
		this.setState({ 
			toggleOn: !this.state.toggleOn
		})
	}
}
