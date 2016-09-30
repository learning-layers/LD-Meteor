import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import { UserPositions } from '../../lib/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('activeUserPositions')
  if (handle.ready()) {
    const userPositions = UserPositions.find({})
    onData(null, { userPositions })
  }
}

class ActiveUserPositions extends Component {
  render () {
    const { userPositions } = this.props
    return <div id='activeUserPositions'>
      <ul>
        {userPositions.map(function (userPosition) {
          return <li>
            {userPosition.userId}
          </li>
        })}
      </ul>
    </div>
  }
}

export default composeWithTracker(onPropsChange)(ActiveUserPositions)
