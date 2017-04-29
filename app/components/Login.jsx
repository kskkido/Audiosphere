import React from 'react'

export const Login = ({ login }) => {
  return (
    <div>
        <a
        target="_self"
        href="api/auth/login/spotify"
        className="btn btn-social btn-google">
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
