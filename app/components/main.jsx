import React from 'react'
import { Link } from 'react-router'
import { Login } from './Login'
import UserControls from './UserControls'
import SideBar from './sidebar'

export default ({children}) => {
  console.log(Login)
  return (
    <div id='home'>
      <h1>YO</h1>
      <Login />
      <UserControls />
      <SideBar />
      { children }
    </div>
  )
}
