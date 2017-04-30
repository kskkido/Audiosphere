import React from 'react'

export const Login = ({ login }) => {
  return (
      <div className="col s12 m2 non-across">
        <a
        target="_self"
        href="api/auth/login/spotify"
        className="btn btn-social z-depth-5">
        <i className="fa fa-google" />
        <span>Login with Spotify</span>
      </a>
      </div>
  )
}

import {login} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

export default connect(
  state => ({}),
  {login},
)(Login)
