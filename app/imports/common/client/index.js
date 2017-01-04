import { Meteor } from 'meteor/meteor'
import ReactDOM from 'react-dom'
import getRoutes from './config/routes'

function checkAuth (nextState, replace) {
  const isAuthed = false
  const nextPathName = nextState.location.pathname
  if (nextPathName === '/' || nextPathName === '/auth') {
    if (isAuthed === true) {
      replace('/feed')
    }
  } else {
    if (isAuthed !== true) {
      replace('/auth')
    }
  }
}

Meteor.startup(() => {
  ReactDOM.render(getRoutes(checkAuth), document.getElementById('app'))
})
