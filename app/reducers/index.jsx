import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  userLibrary: require('./userLibrary').default,
  player: require('./player').default
})

export default rootReducer
