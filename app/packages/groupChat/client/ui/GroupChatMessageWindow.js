import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import { GroupChatMessages } from '../../lib/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('groupChannelMessages', {groupId: props.groupId, channelId: props.topicId})
  if (handle.ready()) {
    const groupChatMessages = GroupChatMessages.find({}).fetch()
    onData(null, { groupChatMessages })
  }
}

class GroupChatMessageWindow extends Component {
  render () {
    const { groupId, groupName, topicId, topicName, groupChatMessages } = this.props
    const reverseGroupChatMessages = groupChatMessages.reverse()
    return <div id='group-chat-message-window'>
      <span style={{display: 'none'}}>
        {topicId ? <span>{groupId} - {groupName} - {topicId} - {topicName}</span> : null}
      </span>
      <ul className='g-chat-msgs'>
        {reverseGroupChatMessages.map(function (groupsChatMessage) {
          return <li key={'g-chat-msg-' + groupsChatMessage._id}>{groupsChatMessage.message}</li>
        })}
      </ul>
    </div>
  }
}

export default composeWithTracker(onPropsChange)(GroupChatMessageWindow)
