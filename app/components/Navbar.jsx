import React from 'react'
import { connect } from 'react-redux'
import { removeCurrentSong } from '../reducers/player'
import { fetchFeaturedPlaylists, fetchInitialData, restartRender } from '../reducers/playlists'
import { init, sceneRender, restartScene } from '../canvasMaterial/songShape'
import { login, logout } from 'APP/app/reducers/auth'

const Navbar = ({ currentPlaylist, fetchFeatured, fetchInitialData, login, logout, playlists, restartRender, user, userPlaylist }) => {

  function renderLogout() {
    return <li><a onClick={() => {
      restartRender()
      restartScene()
      logout()
    } }>Logout</a></li>
  }

  function renderLogin() {
    return (
        <li>
        <a
          target="_self"
          href="api/auth/login/spotify"
          onClick={login}
        >Spotify Login
        </a>
      </li>
    )
  }

  function getFeaturedPlaylists() {
    return (
      <li><a onClick={(event) => {; restartScene(); fetchFeatured()} }>Load Featured Playlists</a></li>
    )
  }

  function getUserPlaylists() {
    return (
      <li><a onClick={(event) => {; restartScene(); fetchInitialData()} }>Load Your Playlists</a></li>
    )
  }

  function isLoggedIn() {
    return userPlaylist ? getFeaturedPlaylists() : getUserPlaylists()
  }

  return (
  <nav className="transparent" id="top-nav">
    {renderDropdown()}
    <div className="wrapper nav-wrapper">
      <a href="#" data-activates="slide-out" className="button-collapse left"><i className="material-icons">menu</i></a>
      <ul id="nav-mobile" className="right" style={{marginRight: '20px'}}>
        {user ? isLoggedIn() : null}
        {user ? renderLogout() : renderLogin()}
        <li><a style={{target: "_blank"}} href="https://www.spotify.com/us/">Spotify</a></li>
      </ul>
    </div>
  </nav>
  )
}

function isLoggedIn() {
  return userPlaylist ? getFeaturedPlaylists() : getUserPlaylists()
}

function renderDropdown () {
  return (
    <ul id="dropdown1" className="dropdown-content">
      <li>Orbital View</li>
      <li>Fly</li>
    </ul>
  )
}

const mapStateToProps = state => ({
  user: state.auth,
  userPlaylist: state.userLibrary.userPlaylist
})

const mapDispatchToProps = dispatch => ({
  fetchFeatured: () => {
    dispatch(removeCurrentSong())
    dispatch(fetchFeaturedPlaylists())
  },
  fetchInitialData: () => {
    dispatch(removeCurrentSong())
    dispatch(fetchInitialData())
  },
  logout: () => dispatch(logout()),
  login: () => dispatch(login()),
  restartRender: () => dispatch(restartRender()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)
