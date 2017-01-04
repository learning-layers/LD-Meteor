import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { MainContainer, HomeContainer } from '../containers'

export default function getRoutes (checkAuth, history) {
  return (
    <Router history={browserHistory}>
      <Route path='/' component={MainContainer}>
        <IndexRoute component={HomeContainer} onEnter={checkAuth} />
      </Route>
    </Router>
  )
}
