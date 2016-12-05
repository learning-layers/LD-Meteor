import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import { UserActivityHistory } from '../../lib/collections'
import { Documents } from '../../../document/lib/collections'
import { TimeFromNow } from '../../../../common/client/ui/util/TimeFromNow'
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
  let handle = Meteor.subscribe('activeUserRecentlyVisited')
  if (handle.ready()) {
    const userActivityHistory = UserActivityHistory.find({})
    onData(null, { userActivityHistory })
  }
}

class RecentlyVisited extends Component {
  render () {
    const { userActivityHistory } = this.props
    return <div id='active-user-positions'>
      <div className='table-responsive'>
        <table className='table table-striped table-bordered table-condensed'>
          <thead>
            <tr>
              <th key='user-pos-userinfo'>Document</th>
              <th key='user-pos-type'>Last visited on</th>
            </tr>
          </thead>
          <tbody>
            {userActivityHistory.map(function (userActivityHistoryItem) {
              const document = Documents.findOne({_id: userActivityHistoryItem.elementId})
              return <tr key={'user-pos-' + userActivityHistoryItem._id}>
                <td><a href={'/document/' + userActivityHistoryItem.elementId}><span className='glyphicon glyphicon-file' /> {document ? document.title : userActivityHistoryItem.elementId}</a></td>
                <td><TimeFromNow date={userActivityHistoryItem.createdAt} /></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  }
}

export default compose(getTrackerLoader(onPropsChange))(RecentlyVisited)
