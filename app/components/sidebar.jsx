import React from 'react'
import { fetchPlaylists, fetchPlaylistSongs, neutralView, setCurrentPlaylist, setToAll } from '../reducers/userLibrary'
import { findById } from 'APP/app/reducers/utils'

import AudioSphereAPI from 'APP/app/audioSphere'
const { selectFromAll, selectFromPlaylist, selectFromSideNav, switchToAll } = AudioSphereAPI

const Sidebar = ({ allSongs, currentPlaylist, playlists, setCurrentPlaylist, setToAll, user }) => {

  function renderPlaylists() {
    return playlists.map((playlist, i) => {
      return (
        <li key={`${i}`} id={`${playlist.id}`}>
          <a onClick={(event) => setCurrentPlaylist(playlist.id)} className="collapsible-header waves-effect playlist-name white-text" value={`${playlist.id}`}>
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
        <li onClick={() => selectFromSideNav(song.track.id)} key={`${i}`} value={`${song.track.id}`}>
          <a className="waves-effect white-text">{`${song.track.name} - ${song.track.artists[0].name}`}</a>
        </li>
      )
    })
  }

  function renderAllSongs() {
    return allSongs.map((song, i) => {
      return (
        <li onClick={() => selectFromSideNav(song.track.id, true)} key={`${i}`} value={`${song.track.id}`}>
          <a className="waves-effect white-text">{`${song.track.name} - ${song.track.artists[0].name}`}</a>
        </li>
      )
    })
  }

  return (

    <div>
      <ul id="slide-out" className="side-nav fixed transparent">
        <ul className="collapsible" data-collapsible="accordion">
          <li>
            {playlists.length > 0 && <a onClick={() => {setToAll(); switchToAll()}} className="collapsible-header waves-effect">
              <span className="white-text">All Songs</span>
            </a>}
            <div className="collapsible-body transparent">
              <ul className="song-list">
                {renderAllSongs()}
              </ul>
            </div>
          </li>
          <li>
            <span className="sidebar-header white-text" style={{fontSize: '23px', paddingLeft: '10px'}}>
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
