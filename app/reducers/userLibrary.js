import axios from 'axios'
import { createUserConfig, findById } from './utils'
import { customAxios } from './auth'

import AudioSphereAPI from '../audioSphere'
const { renderAllPlaylists, switchWorld } = AudioSphereAPI

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
export const restartRender = () => ({type: RESTART})
export const changePlaylist = () => ({type: CHANGE_PLAYLIST})
export const setToAll = () => ({type: SET_TO_ALL})

/* ============ DEFINE REDUCER ============ */

const initialState = {
  userPlaylist: true,
  currentPlaylist: {},
  playlists: [],
  allSongs: [],
}

export default (state=initialState, action) => {
  switch (action.type) {
  case FETCH:
    renderAllPlaylists(action.playlists)
    return Object.assign({}, state, {playlists: action.playlists})

  case SET_CURRENT_PLAYLIST:
    if (state.currentPlaylist.id) {
      document.getElementById(state.currentPlaylist.id).classList.remove("current-playlist", 'active')
    }
    document.getElementById(action.playlistId).classList.add("current-playlist")

    switchWorld(action.playlistId)
    return Object.assign({}, state, {currentPlaylist: findById(state.playlists, action.playlistId)})

  case ADD_SONGS:
    return Object.assign({}, state, {allSongs: state.allSongs.concat(action.songs)})

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

export const fetchPlaylists = featured => dispatch => {
  if (featured) dispatch(changePlaylist())

  const targetUrl = featured ? 'https://api.spotify.com/v1/browse/featured-playlists/?limit=20' : 'https://api.spotify.com/v1/me/playlists/?limit=40'
  customAxios.get(targetUrl)
  .then(res => featured ? res.data.playlists.items : res.data.items)
  .then(playlists => {
    axios.all(playlists.map((playlist, i, arr) => {
      return customAxios.get(playlist.tracks.href)
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

