import React from 'react'
import {connect} from 'react-redux'
import { fetchPlaylists, fetchPlaylistSongs } from '../reducers/playlists'
import { init, initAll, sceneRender } from '../canvasMaterial/songShape'

const CanvasControls = ({ currentPlaylist, playlists, user }) => {
  if (playlists.length > 19) {
    initAll(playlists)
    sceneRender()
  }

  return (
    <div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth,
  playlists: state.userLibrary.playlists,
})

const mapDispatchToProps = null

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasControls)
