import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import { GroupChatMessages } from '../../lib/collections'
import { TimeFromNow } from '../../../../common/client/ui/util/TimeFromNow'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('groupChannelMessages', {groupId: props.groupId, channelId: props.topicId})
  if (handle.ready()) {
    const groupChatMessages = GroupChatMessages.find({}).fetch()
    onData(null, { groupChatMessages })
  }
}

var rgb = []
for (var i = 0; i < 3; i++) {
  rgb.push(Math.floor(Math.random() * 255))
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
          const user = Meteor.users.findOne({_id: groupsChatMessage.from})
          let userName = groupsChatMessage.from
          let chatMsgColor = null
          if (user.profile) {
            userName = user.profile.name
            chatMsgColor = user.profile.chatMsgColor
          } else {
            chatMsgColor = 'rgb(' + rgb.join(',') + ')'
          }
          const userNameStyle = {fontSize: '13.3333px', color: chatMsgColor, fontWeight: 'bold'}
          return <li className='g-chat-msg' key={'g-chat-msg-' + groupsChatMessage._id}>
            <span style={{fontSize: '11.1111px', color: 'lightgrey'}}><TimeFromNow date={groupsChatMessage.createdAt} /></span> -
            <span style={userNameStyle}>{userName}</span>:
            &nbsp;
            {groupsChatMessage.message}
          </li>
        })}
        {reverseGroupChatMessages.length === 0 ? <li className='g-chat-msg' key='g-chat-msg-no-msg'>Be the first one to write a message for this topic</li> : null}
      </ul>
    </div>
  }
}

export default composeWithTracker(onPropsChange)(GroupChatMessageWindow)
