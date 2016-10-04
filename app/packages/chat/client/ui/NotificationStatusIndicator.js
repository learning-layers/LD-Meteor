import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
// import { GroupChatTopics } from '../../../groupChat/lib/collections'
import { Mongo } from 'meteor/mongo'

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

export default composeWithTracker(onPropsChange)(NotificationStatusIndicator)
