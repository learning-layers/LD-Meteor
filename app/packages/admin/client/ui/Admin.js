import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import ReactiveInfiniteList from '../../../infiniteList/client/ui/ReactiveInfiniteList'

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
          <li><a href='/userManagement'>User Management</a></li>
          <li><a href='/logging'>Logging</a></li>
        </ul>
        <ReactiveInfiniteList />
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(Admin)
