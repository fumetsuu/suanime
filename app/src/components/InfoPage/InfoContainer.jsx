import React, { Component } from 'react'

import { connect } from 'react-redux'

class InfoContainer extends Component {
  render() {
    return (
      <div className="info-container-wrapper">
        {this.props.animeName}, {this.props.posterImg}, {this.props.slug}, {this.props.animeID}
      </div>
    )
  }
}

const mapStateToProps = state => {
    return {
        animeName: state.infoReducer.animeName,
        posterImg: state.infoReducer.posterImg,
        slug: state.infoReducer.slug,
        animeID: state.infoReducer.animeID
    }
}

export default connect(mapStateToProps)(InfoContainer)