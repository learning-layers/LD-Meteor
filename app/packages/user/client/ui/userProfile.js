import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'

function onPropsChange (props, onData) {
  const user = Meteor.user()
  onData(null, {user})
}

class UserProfile extends Component {
  render () {
    return (
      <div className='ld-user-profile container-fluid'>
        User Profile
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(UserProfile)
