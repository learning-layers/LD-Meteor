import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
// import { GroupChatTopics } from '../../../groupChat/lib/collections'
import { Mongo } from 'meteor/mongo'
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

let GroupChatNewMessageCount = new Mongo.Collection('GroupChatNewMessageCount')

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('groupChatNotifications')
  if (handle.ready()) {
    const topics = GroupChatNewMessageCount.find({}).fetch()
    onData(null, { topics })
  }
}

class NotificationStatusIndicator extends Component {
  render () {
    const { topics } = this.props
    return <span>
      {JSON.stringify(topics)}
    </span>
  }
}

export default compose(getTrackerLoader(onPropsChange))(NotificationStatusIndicator)
