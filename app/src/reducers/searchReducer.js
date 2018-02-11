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
            return Object.assign({}, state, {
                searchValue: action.payload.searchValue,
                searchSort: action.payload.searchSort,
                searchType: action.payload.searchType,
                searchStatus: action.payload.searchStatus,
                searchGenre: action.payload.searchGenre
            })
        }
        default: return state
    }
} 