import React from 'react'
import { fetchPlaylists, fetchPlaylistSongs } from '../reducers/playlists'
import { init, sceneRender } from '../canvasMaterial/songShape'

const Sidebar = ({ currentPlaylist, playlists, user }) => {
  function renderPlaylistInfo() {
    return currentPlaylist.songs.map(songInfo => {
      return (
        <li key={`${songInfo.track.id}`} id={`${songInfo.track.id}`}>{`${songInfo.track.name} - ${songInfo.track.artists[0].name}`}</li>
      )
    })
  }

  return (
    <div>
      { currentPlaylist.id && <ul className='LOL'><li>{currentPlaylist.name}</li>{renderPlaylistInfo()}</ul> }
    </div>
  )
}

import {login} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

const mapStateToProps = (state) => ({
  user: state.auth,
  playlists: state.userLibrary.playlists,
  songArr: state.userLibrary.songArr,
  currentPlaylist: state.userLibrary.currentPlaylist,
})

const mapDispatchToProps = null

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
