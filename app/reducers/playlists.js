import axios from 'axios'
import { createUserConfig } from './utils'

/* ============ DEFINE ACTION TYPE ============ */

const FETCH = 'FETCH PLAYLIST'
const FETCH_SONGS = 'FETCH SONGS'
const SET_CURRENT_PLAYLIST = 'SET CURRENT PLAYLIST'

/* ============ DEFINE ACTION CREATORS ============ */

export const fetched = playlists => ({ type: FETCH, playlists })
export const fetchedSongs = songArr => ({type: FETCH_SONGS, songArr})

/* ============ DEFINE REDUCER ============ */

const initialState = {
  currentSong: {},
  playlists: {},
  songArr: []
}

export default (state=initialState, action) => {
  switch (action.type) {
  case FETCH:
    return Object.assign({}, state, {playlists: action.playlists})

  case FETCH_SONGS:
    return Object.assign({}, state, {songArr: [...state.songArr, action.songArr]})
  }

  return state
}

/* ============ DEFINE DISPATCHER ============ */

export const fetchPlaylists = user => dispatch => {
  createUserConfig(user).get('https://api.spotify.com/v1/me/playlists')
    .then(res => dispatch(fetched(res.data)))
    .catch(err => console.error('Failed to fetch playlist: ', err))
}

export const fetchPlaylistSongs = (user, playlists) => dispatch => {
  const axiosInstance = createUserConfig(user)
  axios.all(playlists.items.map(playlist => axiosInstance(playlist.tracks.href)))
  .then(res => res.forEach(res => dispatch(fetchedSongs(res.data))))
  .catch(err => console.error('Failed to fetch playlist: ', err))
}

// fetch song everytime a dom object is clicked
