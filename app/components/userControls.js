import React from 'react'
import {connect} from 'react-redux'
import { fetchPlaylists, fetchPlaylistSongs } from '../reducers/playlists'

const UserControls = ({ fetchPlaylists, fetchPlaylistSongs, playlists, songArr, user }) => {

  function getPlaylist() {
    fetchPlaylists(user)
  }

  function getSongs() {
    fetchPlaylistSongs(user, playlists)
  }

  return (
    <div>
      <button onClick={getPlaylist}>GET PLAYLIST</button>
      {playlists.items ? <button onClick={getSongs}>GET SONGS</button> : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth,
  playlists: state.userLibrary.playlists,
  songArr: state.userLibrary.songArr
})

const mapDispatchToProps = dispatch => ({
  fetchPlaylists: user => dispatch(fetchPlaylists(user)),
  fetchPlaylistSongs: (user, playlists) => dispatch(fetchPlaylistSongs(user, playlists))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserControls)
