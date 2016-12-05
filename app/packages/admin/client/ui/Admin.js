import React, { Component } from 'react'
import { compose } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
// import ReactiveInfiniteList from '../../../infiniteList/both/ui/GeneralReactiveInfiniteListTestWrapper'

function getTrackerLoader (reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env)
      })
    })

    return () => {
      if (typeof trackerCleanup === 'function') trackerCleanup()
      return handler.stop()
    }
  }
}

function onPropsChange (props, onData) {
  const user = Meteor.user()
  onData(null, {user})
}

class Admin extends Component {
  render () {
    // const {user} = this.props
    // <ReactiveInfiniteList />
    return (
      <div className='ld-admin'>
        <ul>
          <li><a href='/userManagement'>User Management</a></li>
          <li><a href='/logging'>Logging</a></li>
        </ul>
      </div>
    )
  }
}

export default compose(getTrackerLoader(onPropsChange))(Admin)
