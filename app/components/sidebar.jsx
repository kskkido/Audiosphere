import React from 'react'
import { fetchPlaylists, fetchPlaylistSongs, setCurrentPlaylist } from '../reducers/playlists'
import { init, sceneRender } from '../canvasMaterial/songShape'
import UserControls from './userControls'
import {findById} from '../reducers/utils'

const Sidebar = ({ currentPlaylist, playlists, setCurrentPlaylist, user }) => {

  // function renderPlaylistSongs() {
  //   return currentPlaylist.songs.map(songInfo => <li key={`${songInfo.track.id}`} id={`${songInfo.track.id}`}>{`${songInfo.track.name} - ${songInfo.track.artists[0].name}`}</li>)
  // }

  function renderPlaylists() {
    return playlists.map(playlist => {
      return (
        <li key={`${playlist.id}`}>
          <a onClick={() => selectOnClick(playlist.id)} className="collapsible-header waves-effect" value={`${playlist.id}`}>
            {playlist.name}
          </a>
          <div className="collapsible-body transparent">
            <ul className="song-list">
              {renderPlaylistSongs(playlist.songs)}
            </ul>
          </div>
        </li>
      )
    })
  }

  function renderPlaylistSongs(songList) {
    return songList.map(song => {
      return (
        <li key={`${song.track.id}`} id={`${song.track.id}`}>
            {`${song.track.name} - ${song.track.artists[0].name}`}
        </li>
      )
    })
  }

  function selectOnClick(event) {
    setCurrentPlaylist(playlists, event)
  }

  return (

    <div>
      <ul id="slide-out" className="side-nav fixed collapsible transparent">
        <ul className="collapsible" data-collapsible="accordion">
          <li>
            <a className="collapsible-header waves-effect">
              All Songs
            </a>
          </li>
          <li><div className="divider"></div></li>
          { playlists.length > 0 && renderPlaylists() }
        </ul>
      </ul>
    </div>
  )
}

import {login} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

const mapStateToProps = (state) => ({
  user: state.auth,
  playlists: state.userLibrary.playlists,
  currentPlaylist: state.userLibrary.currentPlaylist,
})

const mapDispatchToProps = dispatch => ({
  setCurrentPlaylist: (playlists, playlistId) => {
    dispatch(setCurrentPlaylist(findById(playlists, playlistId)))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
