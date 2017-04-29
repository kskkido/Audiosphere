'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import store from './store'
import { renderer, sceneRender } from './canvasMaterial/songShape'

import CanvasControls from './components/canvas'
import Login from './components/Login'
import Main from './components/main'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRedirect to="/canvas" />
        <Route path="/canvas" component={CanvasControls} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
document.getElementById('canvas').appendChild(renderer.domElement)

export const AUDIO = document.createElement('audio')
