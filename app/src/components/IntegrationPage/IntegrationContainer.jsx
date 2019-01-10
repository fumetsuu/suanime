import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch} from 'react-router-dom'
// import { connect } from 'react-redux'

// import popura from 'popura'
// const pclient = popura()

import MALReadonlyLogin from './MALReadonlyLogin.jsx'
import MALReadonlyContainer from './MALReadonly/MALReadonlyContainer.jsx'
// import AnimeListContainer from './AnimeList/AnimeListContainer.jsx'
class IntegrationContainer extends Component {
	constructor(props) {
		super(props)
		if(global.estore.get('mal-readonly')) {
			window.location.hash = '#/integration/animelist'
		} else {
			window.location.hash = '#/integration/login'
		}

		// if(global.estore.get('mal') && global.estore.get('mal').user) {
		// 	if(!props.pclient) {
		// 		let { user, pass } = global.estore.get('mal')
		// 		pclient.setUser(user, pass)
		// 		props.setClient(pclient)
		// 	}
		// 	window.location.hash = '#/integration/animelist'
		// } else {
		// 	props.setClient(pclient) //new client, no login details
		// 	window.location.hash = '#/integration/login'
		// }
	}
	
	render() {
		return (
			<Router>
				<div className="integration-wrapper">
					<div className="integration-container">
						<Switch>
							<Route path="/integration/login" component={MALReadonlyLogin}/>
							<Route path="/integration/animelist/:stats?" component={MALReadonlyContainer}/>
						</Switch>
					</div>
				</div>
			</Router>
		)
	}
}

export default IntegrationContainer

// const mapStateToProps = state => {
// 	return {
// 		pclient: state.animelistReducer.pclient
// 	}
// }

// const mapDispatchToProps = dispatch => {
// 	return {
// 		setClient: pclient => dispatch({
// 			type: 'SET_CLIENT',
// 			payload: {
// 				pclient: pclient
// 			}
// 		})
// 	}
// }

// export default connect(mapStateToProps, mapDispatchToProps)(IntegrationContainer)