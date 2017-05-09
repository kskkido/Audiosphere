import React from 'react'
import {connect} from 'react-redux'
import { fetchPlaylists, fetchPlaylistSongs, hasRendered, render } from '../reducers/playlists'
import { init, initAll, sceneRender, switchWorld } from '../canvasMaterial/songShape'

const CanvasControls = ({ currentPlaylist, playlists, render, rendered, user }) => {
  if (playlists.length > 0 && !render) {
    initAll(playlists, currentPlaylist)
    // promisify initAll
    rendered()
    sceneRender()
  }
  if (currentPlaylist.id && render) {
    switchWorld(currentPlaylist)
  }
  return null
}

const mapStateToProps = (state) => ({
  user: state.auth,
  currentPlaylist: state.userLibrary.currentPlaylist,
  playlists: state.userLibrary.playlists,
  render: state.userLibrary.render
})

const mapDispatchToProps = dispatch => ({
  rendered: () => dispatch(hasRendered())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasControls)
