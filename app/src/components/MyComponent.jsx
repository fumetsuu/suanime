import React, { Component } from 'react';

export default class MyComponent extends Component { 
    render() {
        return (
            <h2> this is very {this.props.dummyProp} </h2>
        );
    }
}