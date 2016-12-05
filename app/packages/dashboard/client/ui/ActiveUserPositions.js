import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import { UserPositions } from '../../lib/collections'
import { Documents } from '../../../document/lib/collections'
import { Tracker } from 'meteor/tracker'

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
  let handle = Meteor.subscribe('activeUserPositions')
  if (handle.ready()) {
    const userPositions = UserPositions.find({}).fetch()
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
              <th key='user-pos-type'>Type: Title</th>
            </tr>
          </thead>
          <tbody>
            {userPositions.map(function (userPosition) {
              const user = Meteor.users.findOne({_id: userPosition.userId})
              const document = Documents.findOne({_id: userPosition.elementId})
              return <tr key={'user-pos-' + userPosition._id}>
                <td>{user.profile ? user.profile.name : userPosition.userId}</td>
                <td><a href={'/document/' + userPosition.elementId}><span className='glyphicon glyphicon-file' /> {document ? document.title : userPosition.elementId}</a></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  }
}

export default compose(getTrackerLoader(onPropsChange))(ActiveUserPositions)
