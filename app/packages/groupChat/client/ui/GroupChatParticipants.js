import React, { Component } from 'react'
import EventEmitterInstance from '../../../../common/client/EventEmitter'

class GroupChatParticipants extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: true,
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
  toggleChatParticipantsSidebar () {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  render () {
    const { collapsed, groupId, groupName, topicId, topicName } = this.state
    let groupChatParticipantsClasses = 'g-aside g-aside-2'
    if (collapsed) {
      groupChatParticipantsClasses += ' collapsed'
    }
    return <div id='g-group-chat-participants' className={groupChatParticipantsClasses}>
      {!this.state.collapsed ? <div className='g-scroll'>
        {groupId} - {groupName} - {topicId} - {topicName}
      </div> : <div className='participants'>
        {false ? <span>
          <div style={{display: 'block', marginLeft: '-3px'}}>
            <i className='fa fa-users' />
          </div>
          &nbsp;
          Participants
        </span> : null}
      </div>}
      {false ? <div className='g-close-handle' onClick={() => this.toggleChatParticipantsSidebar()}>
        {collapsed ? <span className='glyphicon glyphicon-chevron-left' /> : <span className='glyphicon glyphicon-chevron-right' />}
      </div> : null}
    </div>
  }
}

export default GroupChatParticipants
