import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'

function onPropsChange (props, onData) {
  const user = Meteor.user()
  onData(null, {user})
}

class Home extends Component {
  render () {
    return (
      <div className='ld-home container-fluid'>
        <h2 className='letterpress-effect'>Living Documents</h2>
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(Home)
