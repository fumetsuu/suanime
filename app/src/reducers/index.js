import { combineReducers } from 'redux'

import downloadsReducer from './downloadsReducer.js'
import animeVideoReducer from './animeVideoReducer.js'

export default combineReducers({
    downloadsReducer,
    animeVideoReducer
})