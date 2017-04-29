import React from 'react'
import { fetchPlaylists, fetchPlaylistSongs } from '../reducers/playlists'
import { init, sceneRender } from '../canvasMaterial/songShape'

const CanvasControls = ({ playlists, songArr, user }) => {

  if (songArr.length > 19) {
    console.log(songArr)
    init(playlists.items[19], songArr[19])
    sceneRender()
  }
  console.log(user)

  function renderPlaylistInfo() {
    playlists.items[19].name
    return songArr[19].items.map(songInfo => {
      console.log(songInfo.track)
      return (
        <li key={`${songInfo.track.id}`} id={`${songInfo.track.id}`}>{`${songInfo.track.name} - ${songInfo.track.artists[0].name}`}</li>
      )
    })
  }

  return (
    <div>
      {songArr.length > 19 && <ul className='LOL'>{renderPlaylistInfo()}</ul>}
    </div>
  )
}

import {login} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

const mapStateToProps = (state) => ({
  user: state.auth,
  playlists: state.userLibrary.playlists,
  songArr: state.userLibrary.songArr,
  currentSong: state.userLibrary.currentSong
})

const mapDispatchToProps = null

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasControls)
