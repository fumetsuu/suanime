import React, { Component } from 'react'
import decodeHTML from 'ent/decode'
import { browserLink } from '../../util/util'
import { launchInfo } from '../../actions/actions'

export default class InfoMain extends Component {
	constructor(props) {
		super(props)
	}
	
	render() {
		if(!this.props.MALData) return <div className="info-main">MAL info not available.</div>
		let { score, rank, premiered, image_url, type, episodes, status, broadcast, studio, source, duration, rating, synopsis, genre, related } = this.props.MALData
		return (
			<div className="info-main">
				<div className="primary-stats">
					<div className="primary-stat">{score}</div> <div className="vertical-blue"/> <div className="primary-stat">#{rank}</div> {!premiered?null:(<div className="primary-stat"><div className="vertical-blue"/>{premiered}</div>)} 
				</div>
				<ul className="genres">
					{this.nameList(genre)}
				</ul>
				<div className="secondary-stats-container">
					<div className="anime-image" style={{backgroundImage: `url('${image_url}')`}}/>
					<table className="secondary-stats">
						<tbody>
							<tr>
								<td className="data-label">Type:</td>
								<td>{type}</td>
							</tr>
							<tr>
								<td className="data-label">Episodes:</td>
								<td>{episodes}</td>
							</tr>
							<tr>
								<td className="data-label">Status:</td>
								<td>{status}</td>
							</tr>
							<tr>
								<td className="data-label">Broadcast:</td>
								<td>{broadcast || '?'}</td>
							</tr>
							<tr>
								<td className="data-label">Studio:</td>
								<td>{studio[0]?studio[0].name : 'None'}</td>
							</tr>
							<tr>
								<td className="data-label">Source:</td>
								<td>{source}</td>
							</tr>
							<tr>
								<td className="data-label">Duration:</td>
								<td>{duration}</td>
							</tr>
							<tr>
								<td className="data-label">Rating:</td>
								<td>{rating}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="synopsis-main">{decodeHTML(synopsis)}</div>
				<table className="related-anime">
					<tbody>{this.relatedList(related)}</tbody>
				</table>
			</div>
		)
	}

	nameList(data) {
		return data.map((el, i) => <span key={i}>{i?<div className="vertical-blue"/>:null}<span className="info-clickable" onClick={()=>browserLink(el.url)}>{decodeHTML(el.name)}</span></span>)
	}

	relatedList(data) {
		let relations = Object.keys(data)
		if(!relations.length) return null
		let tablerows = []
		relations.forEach(relation => {
			tablerows.push(
				<tr key={relation}>
					<td className="data-label">{relation}</td>
					<td>{data[relation].map((el, i) => <span key={el.mal_id}>{i?', ':''}<span className={el.type=='manga'?'related-link disabled':'related-link'} onClick={() => {launchInfo(decodeHTML(el.title), null, null, el.mal_id)}}>{decodeHTML(el.title)}</span></span>)}</td>
				</tr>
			)
		})
		return tablerows
	}
}
