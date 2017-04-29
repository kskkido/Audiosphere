
import {AUDIO} from '../main'

const SET_CURRENT_SONG = 'SET CURRENT SONG'
const START_PLAYING = 'START PLAYING'
const STOP_PLAYING = 'STOP PLAYING'
const SET_LIST = 'SET LIST'
const REMOVE_CURRENT_SONG = ' REMOVE CURRENT SONG'

const playSong = song => ({type: SET_CURRENT_SONG, song})
export const stopSong = () => ({type: REMOVE_CURRENT_SONG})

export const initialPlayerState = {
  currentSong: {},
  currentSongList: [],
  isPlaying: false,
  progress: 0
}

export default (state = initialPlayerState, action) => {
  switch (action.type) {
  case START_PLAYING:
    return Object.assign({}, state, {isPlaying: true})

  case STOP_PLAYING:
    return Object.assign({}, state, {isPlaying: true})

  case SET_CURRENT_SONG:
    return Object.assign({}, state, {currentSong: action.song})

  case REMOVE_CURRENT_SONG:
    return Object.assign({}, state, {currentSong: {}})

  case SET_LIST:
    return Object.assign({}, state, {isPlaying: true})

  default:
    return state
  }
}

export const setCurrentSong = (song) => dispatch => {
  AUDIO.play()
  dispatch(playSong(song))
}

export const removeCurrentSong = () => dispatch => {
  AUDIO.src = null
  dispatch(stopSong())
}
