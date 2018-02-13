import React, { Component } from 'react'
import { HashRouter as Router, NavLink, Route, Switch, Redirect} from 'react-router-dom'

import IntegrationLogin from './IntegrationLogin.jsx'
import AnimeListContainer from './AnimeList/AnimeListContainer.jsx'
export default class IntegrationContainer extends Component {
  constructor(props) {
    super(props)
    if(global.estore.get("mal") && global.estore.get("mal").user) {
      window.location.hash = "#/integration/animelist"
    } else {
      window.location.hash = "#/integration/login"
    }
  }
  
  render() {
    return (
      <Router>
        <div className="integration-wrapper">
          <div className="integration-container">
            <Switch>
              <Route path="/integration/login" component={IntegrationLogin}/>
              <Route path="/integration/animelist" component={AnimeListContainer}/>
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}
