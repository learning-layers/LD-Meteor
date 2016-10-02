import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import { GroupChatTopics } from '../../lib/collections'
import AddChatTopicModal from './AddChatTopicModal'

/*
 {groups.map(function (group) {
 return <li key={'g-chat-c-' + group._id}>
 <a className='g-group-name' href='' data-tooltip={group.name}>
 {group.name}
 </a>
 </li>
 })}
 */

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('groupChannels', {groupId: props.activeGroupId})
  if (handle.ready()) {
    const topics = GroupChatTopics.find({}).fetch()
    onData(null, { topics })
  }
}

class GroupChatChannel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openAddChatTopicModal: null
    }
  }
  openCreateNewChatTopic (activeGroupId) {
    let renderToElement = this.refs.addChatTopicModal
    if (!this.state.openAddChatTopicModal) {
      this.state.openAddChatTopicModal = ReactDOM.render(<AddChatTopicModal activeGroupId={activeGroupId} />, renderToElement)
    } else {
      this.state.openAddChatTopicModal.open(activeGroupId)
    }
  }
  render () {
    const { topics } = this.props
    return <span>
      <ul className='g-channel-list'>
        <li>
          <a href='' onClick={() => this.openCreateNewChatTopic(this.props.activeGroupId)}>
            <span className='glyphicon glyphicon-plus' />
            {' Add new chat topic'}
          </a>
        </li>
        {topics.map(function (topic) {
          return <li>#{topic.name}</li>
        })}
      </ul>
      <div ref='addChatTopicModal'></div>
    </span>
  }
}

export default composeWithTracker(onPropsChange)(GroupChatChannel)
