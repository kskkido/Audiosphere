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
        <IndexRedirect to="/tentative" />
        <Route path="/tentative" component={CanvasControls} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)

export const AUDIO = document.createElement('audio')
