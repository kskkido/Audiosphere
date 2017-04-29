import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  userLibrary: require('./playlists').default,
  player: require('./player').default
})

export default rootReducer
