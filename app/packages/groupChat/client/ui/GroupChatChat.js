import React, { Component } from 'react'
import EventEmitterInstance from '../../../../common/client/EventEmitter'
import GroupChatMessageWindow from './GroupChatMessageWindow'
import GroupChatMessageInput from './GroupChatMessageInput'

class GroupChatChat extends Component {
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
    const { groupId, groupName, topicId, topicName } = this.state
    return <div className='g-main'>
      <GroupChatMessageWindow groupId={groupId} groupName={groupName} topicId={topicId} topicName={topicName} />
      <GroupChatMessageInput groupId={groupId} groupName={groupName} topicId={topicId} topicName={topicName} />
    </div>
  }
}

export default GroupChatChat
