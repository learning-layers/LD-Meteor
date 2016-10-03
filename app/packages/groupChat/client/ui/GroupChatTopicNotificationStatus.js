import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Checkbox from '../../../../../node_modules/react-bootstrap/lib/Checkbox'
import { GroupChatTopics } from '../../lib/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('groupChannel', {groupId: props.groupId, channelId: props.topicId})
  if (handle.ready()) {
    const topic = GroupChatTopics.findOne({_id: props.topicId})
    onData(null, { topic })
  }
}

class GroupChatTopicNotificationStatus extends Component {
  toggleChangeNotification (groupId, topicId, userWantsToBeNotified) {
    if (userWantsToBeNotified) {
      Meteor.call('disableGroupChatNotifications', groupId, topicId)
    } else {
      Meteor.call('enableGroupChatNotifications', groupId, topicId)
    }
  }
  render () {
    const { groupId, topic } = this.props
    let userWantsToBeNotified = false
    if (topic && topic.wantToBeNotified) {
      topic.wantToBeNotified.forEach(function (wantsToBeNotified) {
        if (wantsToBeNotified.userId === Meteor.userId()) { userWantsToBeNotified = true }
      })
    }
    return <div>
      <Checkbox checked={userWantsToBeNotified} onClick={() => this.toggleChangeNotification(groupId, topic._id, userWantsToBeNotified)}>
        Notify me about changes
      </Checkbox>
    </div>
  }
}

export default composeWithTracker(onPropsChange)(GroupChatTopicNotificationStatus)
