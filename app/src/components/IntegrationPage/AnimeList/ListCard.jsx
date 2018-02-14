import React, { Component } from 'react'
const path = require('path')
const imageCache = require('image-cache')
imageCache.setOptions({
    dir: path.join(__dirname, '../mal-cache/'),
    compressed: false
})

export default class ListCard extends Component {
    render() {
        let { series_image } = this.props.animeData
        let imgfile = series_image
        imageCache.fetchImages(series_image).then(images => {
            imgfile = images.hashFile
        })
        return (
        <div className="list-card-container">
            <div className="bg-img" style={{ backgroundImage: `url('${imgfile}')`}}/>
        </div>
        )
    }
}
