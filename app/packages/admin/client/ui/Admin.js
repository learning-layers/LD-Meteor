import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'

function onPropsChange (props, onData) {
  const user = Meteor.user()
  onData(null, {user})
}

class Admin extends Component {
  render () {
    // const {user} = this.props
    return (
      <div className='ld-admin'>
        <ul>
          <li><a>User Management</a></li>
          <li><a>Logging</a></li>
        </ul>
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(Admin)
