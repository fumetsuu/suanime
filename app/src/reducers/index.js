import { combineReducers } from 'redux'

import downloadsReducer from './downloadsReducer.js'
import animeVideoReducer from './animeVideoReducer.js'
import searchReducer from './searchReducer.js'

export default combineReducers({
    downloadsReducer,
    animeVideoReducer,
    searchReducer
})