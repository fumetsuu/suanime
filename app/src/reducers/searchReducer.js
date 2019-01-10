import React from 'react'
import { sortOptions, typeOptions, statusOptions, genreOptions } from '../components/SearchPage/searchOptionsData.js'

export default function reducer(state = {
	searchValue: '',
	searchSort: sortOptions[0],
	searchType: typeOptions[0],
	searchStatus: statusOptions[0],
	searchGenre: genreOptions[0]
}, action) {
	switch(action.type) {
		case 'SEARCH': {
			var { searchValue, searchSort, searchType, searchStatus, searchGenre } = action.payload
			return Object.assign({}, state, {
				searchValue,
				searchSort,
				searchType,
				searchStatus,
				searchGenre
			})
		}
		default: return state
	}
} 