import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import Checkbox from '../../../../../node_modules/react-bootstrap/lib/Checkbox'
import { GroupChatTopics } from '../../lib/collections'
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
    const { groupId, topic, topicId } = this.props
    let userWantsToBeNotified = false
    if (topic && topic.wantToBeNotified) {
      topic.wantToBeNotified.forEach(function (wantsToBeNotified) {
        if (wantsToBeNotified.userId === Meteor.userId()) { userWantsToBeNotified = true }
      })
    }
    return <div>
      <Checkbox checked={userWantsToBeNotified} onChange={() => this.toggleChangeNotification(groupId, topicId, userWantsToBeNotified)}>
        Notify me about changes
      </Checkbox>
    </div>
  }
}

export default compose(getTrackerLoader(onPropsChange))(GroupChatTopicNotificationStatus)
