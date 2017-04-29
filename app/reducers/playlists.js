import axios from 'axios'
import { createUserConfig, findById } from './utils'
import { testAxiosInstance } from './auth'

/* ============ DEFINE ACTION TYPE ============ */

const FETCH = 'FETCH PLAYLIST'
const FETCH_SONGS = 'FETCH SONGS'
const SET_CURRENT_PLAYLIST = 'SET CURRENT PLAYLIST'
const ADD_SONGS = 'ADD SONGS'

/* ============ DEFINE ACTION CREATORS ============ */

export const fetched = playlists => ({ type: FETCH, playlists })
export const fetchedSongs = songArr => ({type: FETCH_SONGS, songArr})
export const setCurrentPlaylist = playlist => ({type: SET_CURRENT_PLAYLIST, playlist})
export const addSongs = songs => ({type: ADD_SONGS, songs})

/* ============ DEFINE REDUCER ============ */

const initialState = {
  currentPlaylist: {},
  playlists: [],
  allSongs: []
}

export default (state=initialState, action) => {
  switch (action.type) {
  case FETCH:
    return Object.assign({}, state, {playlists: action.playlists})

  case SET_CURRENT_PLAYLIST:
    return Object.assign({}, state, {currentPlaylist: action.playlist})

  case ADD_SONGS:
    const filtered = action.songs.filter(song => state.allSongs.indexOf(song) > -1)
    return Object.assign({}, state, {allSongs: [state.allSongs, ...filtered]})
  }

  return state
}

/* ============ DEFINE DISPATCHER ============ */

// export const fetchPlaylists = user => dispatch => {
//   createUserConfig(user).get('https://api.spotify.com/v1/me/playlists')
//     .then(res => dispatch(fetched(res.data.items)))
//     .catch(err => console.error('Failed to fetch playlist: ', err))
// }
//
// export const fetchPlaylistSongs = (user, playlists) => dispatch => {
//   const axiosInstance = createUserConfig(user)
//   axios.all(playlists.map(playlist => axiosInstance(playlist.tracks.href)))
//   .then(res => res.forEach(res => dispatch(fetchedSongs(res.data))))
//   .catch(err => console.error('Failed to fetch playlist: ', err))
// }

export const fetchInitialData = user => dispatch => {
  testAxiosInstance.get('https://api.spotify.com/v1/me/playlists')
  .then(res => res.data.items)
  .then(playlists => {
    axios.all(playlists.map((playlist, i, arr) => {
      return testAxiosInstance.get(playlist.tracks.href)
      .then(res => arr[i].songs = res.data.items)
    }))
    .then((res) => {
      dispatch(addSongs(res.reduce((total, current) => [...total, ...current], [])))
      dispatch(fetched(playlists))
      dispatch(setCurrentPlaylist(playlists[0]))
    })
  })
}

// fetch song everytime a dom object is clicked
