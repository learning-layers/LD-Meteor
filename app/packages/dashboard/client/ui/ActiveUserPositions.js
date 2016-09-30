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
    return <div id='active-user-positions'>
      <div className='table-responsive'>
        <table className='table table-striped table-bordered table-condensed'>
          <thead>
            <tr>
              <th key='user-pos-userinfo'>User</th>
              <th key='user-pos-type'>Type</th>
              <th key='user-pos-options'>Options</th>
            </tr>
          </thead>
          <tbody>
          {userPositions.map(function (userPosition) {
            return <tr key={'user-pos-' + userPosition._id}>
              <td>{userPosition.userId}</td>
              <td>{userPosition.type}</td>
              <td>{userPosition.elementId}</td>
            </tr>
          })}
          </tbody>
        </table>
      </div>
    </div>
  }
}

export default composeWithTracker(onPropsChange)(ActiveUserPositions)
