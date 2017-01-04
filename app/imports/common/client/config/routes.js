import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import { MainContainer } from '../containers'
import { getHomeRoute } from '../../../packages/home/client/config/routes'

export default function getRoutes (checkAuth, history) {
  return (
    <Router history={browserHistory}>
      <Route path='/' component={MainContainer}>
        {getHomeRoute(checkAuth)}
      </Route>
    </Router>
  )
}
