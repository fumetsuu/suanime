import React, { Component } from 'react';
import { render } from 'react-dom';

require("./styles/main.sass");

import MyComponent from './components/MyComponent.jsx';

const reactLogo = require('./assets/react.png');

export default class App extends Component {
    render() {
        return(
            <div>
                <div className="title"> Hello </div>

                <img src= {reactLogo} />

                <MyComponent dummyProp="random!" />

            </div>
        );
    }
}