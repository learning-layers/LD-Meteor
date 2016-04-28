import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'

function onPropsChange (props, onData) {
  const user = Meteor.user()
  onData(null, {user})
}

class Home extends Component {
  render () {
    const {user} = this.props
    return (
      <div className='ld-home'>
        Home
        {user && user.profile ? user.profile.name : null}
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(Home)
