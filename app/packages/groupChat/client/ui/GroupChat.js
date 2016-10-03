import React, { Component } from 'react'
import GroupChatGroups from './GroupChatGroups'
import GroupChatChat from './GroupChatChat'
import GroupChatParticipants from './GroupChatParticipants'
import EventEmitterInstance from '../../../../common/client/EventEmitter'

class GroupChatHeader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      groupId: null,
      groupName: null,
      topicId: null,
      topicName: null
    }
  }
  componentDidMount () {
    this.chatTopicSubscription = EventEmitterInstance.addListener('open-group-chat', (groupId, groupName, topicId, topicName) => {
      this.setState({
        groupId: groupId,
        groupName: groupName,
        topicId: topicId,
        topicName: topicName
      })
    })
  }
  componentWillUnmount () {
    if (this.chatTopicSubscription) {
      this.chatTopicSubscription.remove()
    }
  }
  render () {
    const { groupName, topicName } = this.state
    return <div className='g-top-bar'>
      <i className='fa fa-users' />
      &nbsp;
      <span className='glyphicon glyphicon-comment' style={{marginRight: '5px'}} />
      {groupName !== null && topicName !== null ? ' ' + this.state.groupName + ' - #' + this.state.topicName : null}
    </div>
  }
}

class GroupChat extends Component {
  render () {
    return <div id='group-chat' className='container-fluid'>
      <div className='group-chat-window'>
        <GroupChatHeader />
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
