import React from 'react'
import {connect} from 'react-redux'
import { fetchPlaylists, fetchPlaylistSongs } from '../reducers/playlists'
import { init, sceneRender } from '../canvasMaterial/songShape'
import {login} from 'APP/app/reducers/auth'

const Navbar = ({ currentPlaylist, playlists, user }) => {

  return (
  <nav className="transparent" id="top-nav">
    {renderLoginDropdown()}
    <div className="wrapper nav-wrapper">
      <a href="#" data-activates="slide-out" className="button-collapse left"><i className="material-icons">menu</i></a>
      <ul id="nav-mobile" className="right">
      <li><a className="dropdown-button" data-beloworigin="true" href="#!" data-activates="dropdown1">Toggle Camera<i className="material-icons right">arrow_drop_down</i></a></li>
         <li><a className="dropdown-button" data-beloworigin="true" href="#!" data-activates="dropdown1">Account<i className="material-icons right">arrow_drop_down</i></a></li>
        <li><a>Spotify</a></li>
      </ul>
    </div>
  </nav>
  )
}

function renderLoginDropdown () {
  return (
    <ul id="dropdown1" className="dropdown-content">
      <li>Login Through Spotify</li>
      <li>Make An Account</li>
    </ul>
  )
}

const mapStateToProps = null

const mapDispatchToProps = null

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)
