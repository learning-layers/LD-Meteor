import React, { Component } from 'react'
import GroupChatGroups from './GroupChatGroups'
import GroupChatChat from './GroupChatChat'
import GroupChatParticipants from './GroupChatParticipants'

class GroupChat extends Component {
  render () {
    return <div id='group-chat' className='container-fluid'>
      <div className='group-chat-window'>
        <div className='g-top-bar'>
          <i className='fa fa-users' />
          &nbsp;
          <span className='glyphicon glyphicon-comment' style={{marginRight: '5px'}} />
          &lt; Group Chat Name &gt;
        </div>
        <div className='g-chat-wrapper'>
          <GroupChatGroups />
          <GroupChatChat />
          <GroupChatParticipants />
        </div>
      </div>
    </div>
  }
}

export default GroupChat
