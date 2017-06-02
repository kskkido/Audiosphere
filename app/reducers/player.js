
import {AUDIO} from '../main'
import {testAxiosInstance} from './auth'

const featureCache = []

const SET_CURRENT_SONG = 'SET CURRENT SONG'
const START_PLAYING = 'START PLAYING'
const STOP_PLAYING = 'STOP PLAYING'
const SET_FEATURES = 'SET FEATURES'
const REMOVE_CURRENT_SONG = ' REMOVE CURRENT SONG'

const playSong = song => ({type: SET_CURRENT_SONG, song})
const stopSong = () => ({type: REMOVE_CURRENT_SONG})
const setFeatures = features => ({type: SET_FEATURES, features})

const initialPlayerState = {
  currentSong: {},
  currentSongFeatures: {},
  currentSongList: [],
  isPlaying: false,
  progress: 0
}

export default (state = initialPlayerState, action) => {
  switch (action.type) {
  case START_PLAYING:
    return Object.assign({}, state, {isPlaying: true})

  case STOP_PLAYING:
    return Object.assign({}, state, {isPlaying: false})

  case SET_CURRENT_SONG:
    return Object.assign({}, state, {currentSong: action.song})

  case REMOVE_CURRENT_SONG:
    return Object.assign({}, state, {currentSong: {}})

  case SET_FEATURES:
    return Object.assign({}, state, {currentSongFeatures: action.features})

  default:
    return state
  }
}

export const setCurrentSong = (song) => dispatch => {
  AUDIO.play()
  dispatch(playSong(song))
  return testAxiosInstance(`https://api.spotify.com/v1/audio-analysis/${song.id}`)
    .then((res) => {
      return dispatch(setFeatures(res.data))
    })
    .catch(err => console.error('Failed to get song features', err))
}

export const removeCurrentSong = () => dispatch => {
  AUDIO.src = null
  dispatch(stopSong())
}
