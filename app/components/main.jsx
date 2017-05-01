import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import { Login } from './Login'
import Navbar from './Navbar'
import SideBar from './sidebar'

const Main = ({children, user}) => {
  return (
    <div id='home'>
      {/* <h1>YO</h1> */}
        {/*!user && <Login />*/}
        <Navbar />
        <div className="non-across">
  		    <SideBar />
  	      { children }
        </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth,
})

const mapDispatchToProps = null

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)