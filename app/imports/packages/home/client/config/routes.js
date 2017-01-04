import React from 'react'
import { IndexRoute } from 'react-router'
import HomeContainer from '../container/HomeContainer'
import { MainLayout } from '../../../../common/client/components'

export function getHomeRoute (checkAuth) {
  return (
    <IndexRoute component={() => <MainLayout content={((props) => <HomeContainer />)()} />} onEnter={checkAuth} />
  )
}
