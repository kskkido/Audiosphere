import React from 'react'
import { fetchPlaylists, fetchPlaylistSongs, neutralView, setCurrentPlaylist } from '../reducers/playlists'
import { centerAll, findBySongId, init, sceneRender } from '../canvasMaterial/songShape'
import UserControls from './userControls'
import {findById} from '../reducers/utils'

const Sidebar = ({ allSongs, currentPlaylist, playlists, setCurrentPlaylist, user }) => {

  // function renderPlaylistSongs() {
  //   return currentPlaylist.songs.map(songInfo => <li key={`${songInfo.track.id}`} id={`${songInfo.track.id}`}>{`${songInfo.track.name} - ${songInfo.track.artists[0].name}`}</li>)
  // }

  function renderPlaylists() {
    return playlists.map(playlist => {
      return (
        <li key={`${playlist.id}`} id={`${playlist.id}`}>
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
    return songList.map(song => {
      return (
        <li onClick={() => selectSong(song.track.id)} key={`${song.track.id}`} value={`${song.track.id}`}>
          <a className="waves-effect">{`${song.track.name} - ${song.track.artists[0].name}`}</a>
        </li>
      )
    })
  }

  function renderAllSongs() {
    return allSongs.map(song => {
      return (
        <li onClick={() => selectSong(song.track.id)} key={`${song.track.id}allSongs`} value={`${song.track.id}`}>
          <a className="waves-effect">{`${song.track.name} - ${song.track.artists[0].name}`}</a>
        </li>
      )
    })
  }

  function selectPlaylist(playlistId, event) {
    console.log(event.target.classList.contains('active'))
    setCurrentPlaylist(playlistId)
  }

  function selectSong(songId, all) {
    findBySongId(songId, currentPlaylist, all)
  }

  return (

    <div >
      <ul id="slide-out" className="side-nav fixed transparent">
        <ul className="collapsible" data-collapsible="accordion">
          <li>
            <a onClick={centerAll} className="collapsible-header waves-effect">
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
              Your Playlists:
            </span>
          </li>
          { playlists.length > 0 && renderPlaylists() }
        </ul>
      </ul>
    </div>
  )
}

import {login} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
  user: state.auth,
  playlists: state.userLibrary.playlists,
  currentPlaylist: state.userLibrary.currentPlaylist,
  allSongs: state.userLibrary.allSongs,
})

const mapDispatchToProps = dispatch => ({
  setCurrentPlaylist: playlistId => dispatch(setCurrentPlaylist(playlistId))
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
