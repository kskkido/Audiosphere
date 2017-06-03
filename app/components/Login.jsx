import React from 'react'

export const Login = ({ login }) => {
  return (
      <div className="initial-overlay">
        <div className="login">
          <a
            href="api/auth/login/spotify"
            >
            Login with Spotify
          </a>
        </div>
      </div>
  )
}

import {login} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

export default connect(
  state => ({}),
  {login},
)(Login)
