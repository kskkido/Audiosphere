import React from 'react'
import { fetchPlaylists, fetchPlaylistSongs, neutralView, setCurrentPlaylist, setToAll } from '../reducers/playlists'
import { findFromAll, findBySongId, init, sceneRender, switchToAll } from '../canvasMaterial/songShape'
import UserControls from './userControls'
import { findById } from '../reducers/utils'

const Sidebar = ({ allSongs, currentPlaylist, playlists, setCurrentPlaylist, setToAll, user }) => {

  function renderPlaylists() {
    return playlists.map((playlist, i) => {
      return (
        <li key={`${i}`} id={`${playlist.id}`}>
          <a onClick={(event) => selectPlaylist(playlist.id, event)} className="collapsible-header waves-effect playlist-name" value={`${playlist.id}`}>
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
    return songList.map((song, i) => {
      return (
        <li onClick={() => selectSong(song.track.id)} key={`${i}`} value={`${song.track.id}`}>
          <a className="waves-effect">{`${song.track.name} - ${song.track.artists[0].name}`}</a>
        </li>
      )
    })
  }

  function renderAllSongs() {
    return allSongs.map((song, i) => {
      return (
        <li onClick={() => selectFromAll(song.track.id)} key={`${i}`} value={`${song.track.id}`}>
          <a className="waves-effect">{`${song.track.name} - ${song.track.artists[0].name}`}</a>
        </li>
      )
    })
  }

  function selectPlaylist(playlistId, event) {
    setCurrentPlaylist(playlistId)
  }

  function selectSong(songId) {
    findBySongId(songId, currentPlaylist)
  }

  function selectFromAll(songId) {
    findFromAll(songId)
  }

  return (

    <div >
      <ul id="slide-out" className="side-nav fixed transparent">
        <ul className="collapsible" data-collapsible="accordion">
          <li>
            <a onClick={() => {setToAll(); switchToAll()}} className="collapsible-header waves-effect">
              All Songs
            </a>
            <div className="collapsible-body transparent">
              <ul className="song-list">
                {renderAllSongs()}
              </ul>
            </div>
          </li>
          <li>
            <span className="sidebar-header" style={{fontSize: '23px', paddingLeft: '10px'}}>
              Playlists:
            </span>
          </li>
          { playlists.length > 0 && renderPlaylists() }
        </ul>
      </ul>
    </div>
  )
}

import { login } from 'APP/app/reducers/auth'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  user: state.auth,
  playlists: state.userLibrary.playlists,
  currentPlaylist: state.userLibrary.currentPlaylist,
  allSongs: state.userLibrary.allSongs,
})

const mapDispatchToProps = dispatch => ({
  setCurrentPlaylist: playlistId => dispatch(setCurrentPlaylist(playlistId)),
  setToAll: () => dispatch(setToAll())
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
