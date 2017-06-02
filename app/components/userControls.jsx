import React from 'react'
import {connect} from 'react-redux'
import {findById} from '../reducers/utils'
import { fetchPlaylists, fetchPlaylistSongs, setCurrentPlaylist } from '../reducers/playlists'

const UserControls = ({ playlists, setCurrentPlaylist, user }) => {

  function renderDropdown() {
    return playlists.map((playlist, i) => <option key={`${i}`} value={playlist.id}>{playlist.name}</option>)
  }

  function selectOnChange(event) {
    setCurrentPlaylist(playlists, event.target.value)
  }

  return (
    <div>
      <select onChange={selectOnChange}>{playlists.length && renderDropdown()}</select>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth,
  playlists: state.userLibrary.playlists,
  songArr: state.userLibrary.songArr
})

const mapDispatchToProps = dispatch => ({
  setCurrentPlaylist: (playlists, playlistId) => {
    dispatch(setCurrentPlaylist(findById(playlists, playlistId)))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserControls)
