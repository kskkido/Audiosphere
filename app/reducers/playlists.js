import axios from 'axios'
import { createUserConfig, findById } from './utils'
import { testAxiosInstance } from './auth'

/* ============ DEFINE ACTION TYPE ============ */

const FETCH = 'FETCH PLAYLIST'
const FETCH_SONGS = 'FETCH SONGS'
const SET_CURRENT_PLAYLIST = 'SET CURRENT PLAYLIST'
const ADD_SONGS = 'ADD SONGS'
const RENDERED = 'RENDERED'
const RESTART = 'RESTART RENDER'
const CHANGE_PLAYLIST = 'CHANGE PLAYLIST'
const SET_TO_ALL = 'SET TO ALL'

/* ============ DEFINE ACTION CREATORS ============ */

export const fetched = playlists => ({ type: FETCH, playlists })
export const fetchedSongs = songArr => ({type: FETCH_SONGS, songArr})
export const setCurrentPlaylist = playlistId => ({type: SET_CURRENT_PLAYLIST, playlistId})
export const addSongs = songs => ({type: ADD_SONGS, songs})
export const hasRendered = () => ({type: RENDERED})
export const restartRender = () => ({type: RESTART})
export const changePlaylist = () => ({type: CHANGE_PLAYLIST})
export const setToAll = () => ({type: SET_TO_ALL})

/* ============ DEFINE REDUCER ============ */

const initialState = {
  render: false,
  userPlaylist: true,
  currentPlaylist: {},
  playlists: [],
  allSongs: [],
}

export default (state=initialState, action) => {
  switch (action.type) {
  case FETCH:
    return Object.assign({}, state, {playlists: action.playlists})

  case SET_CURRENT_PLAYLIST:
    if (state.currentPlaylist.id) {
      document.getElementById(state.currentPlaylist.id).classList.remove("current-playlist", 'active')
    }
    document.getElementById(action.playlistId).classList.add("current-playlist")
    return Object.assign({}, state, {currentPlaylist: findById(state.playlists, action.playlistId)})

  case ADD_SONGS:
    return Object.assign({}, state, {allSongs: state.allSongs.concat(action.songs)})

  case RENDERED:
    return Object.assign({}, state, {render: true})

  case RESTART:
    return initialState

  case CHANGE_PLAYLIST:
    return Object.assign({}, initialState, {userPlaylist: !state.userPlaylist})

  case SET_TO_ALL:
    if (state.currentPlaylist.id) {
      document.getElementById(state.currentPlaylist.id).classList.remove("current-playlist", 'active')
    }
    return Object.assign({}, state, {currentPlaylist: {}})
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
  dispatch(restartRender())
  testAxiosInstance.get('https://api.spotify.com/v1/me/playlists/?limit=30')
  .then(res => res.data.items)
  .then(playlists => {
    axios.all(playlists.map((playlist, i, arr) => {
      return testAxiosInstance.get(playlist.tracks.href)
      .then(res => arr[i].songs = res.data.items)
    }))
    .then((res) => {
      dispatch(addSongs(res.reduce((total, current) => [...total, ...current], [])))
      dispatch(fetched(playlists))
      dispatch(setCurrentPlaylist(playlists[0].id))
    })
  })
  .catch(err => console.error('Failed to initialize ', err))
}

export const fetchFeaturedPlaylists = user => dispatch => {
  dispatch(changePlaylist())
  testAxiosInstance.get('https://api.spotify.com/v1/browse/featured-playlists/?limit=10')
  .then(res => res.data.playlists.items)
  .then(playlists => {
    axios.all(playlists.map((playlist, i, arr) => {
      return testAxiosInstance.get(playlist.tracks.href)
      .then(res => arr[i].songs = res.data.items)
    }))
    .then((res) => {
      dispatch(addSongs(res.reduce((total, current) => [...total, ...current], [])))
      dispatch(fetched(playlists))
      dispatch(setCurrentPlaylist(playlists[0].id))
    })
  })
  .catch(err => console.error('Failed to initialize ', err))
}



// fetch song everytime a dom object is clicked
