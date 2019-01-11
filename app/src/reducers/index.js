import { combineReducers } from 'redux'

import downloadsReducer from './downloadsReducer'
import animeVideoReducer from './animeVideoReducer'
import searchReducer from './searchReducer'
import animelistReducer from './animelistReducer'
import MALReadonlyReducer from './MALReadonlyReducer'

export default combineReducers({
	downloadsReducer,
	animeVideoReducer,
	searchReducer,
	animelistReducer,
	MALReadonlyReducer
})