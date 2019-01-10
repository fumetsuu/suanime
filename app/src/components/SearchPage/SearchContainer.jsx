import React from 'react'

import SearchOptions from './SearchOptions.jsx'
import SearchResults from './SearchResults.jsx'

const SearchContainer = () => (
	<div className="search-container-wrapper">
		<div className="search-container">
			<SearchOptions/>
			<SearchResults/>
		</div>
	</div>
)

export default SearchContainer
