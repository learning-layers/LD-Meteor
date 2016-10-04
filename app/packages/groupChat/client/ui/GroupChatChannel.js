import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import { GroupChatTopics } from '../../lib/collections'
import AddChatTopicModal from './AddChatTopicModal'
import EventEmitterInstance from '../../../../common/client/EventEmitter'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('groupChannels', {groupId: props.activeGroupId})
  if (handle.ready()) {
    const topics = GroupChatTopics.find({groupId: props.activeGroupId}).fetch()
    onData(null, { topics })
  }
}

class GroupChatChannel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openAddChatTopicModal: null
    }
    if (props.topics.length > 0) {
      this.state.activeTopicId = props.topics[0]._id
      Meteor.setTimeout(() => {
        EventEmitterInstance.emit('open-group-chat', props.activeGroupId, props.groupName, this.state.activeTopicId, props.topics[0].name)
      }, 150)
    } else {
      this.state.activeTopicId = null
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
  changeActiveTopic (topicId) {
    const nextActiveTopic = GroupChatTopics.findOne({_id: topicId})
    Meteor.setTimeout(() => {
      EventEmitterInstance.emit('open-group-chat', this.props.activeGroupId, this.props.groupName, topicId, nextActiveTopic.name)
    }, 150)
    this.setState({activeTopicId: topicId})
  }
  render () {
    const { topics } = this.props
    return <span>
      <ul className='g-channel-list'>
        <li>
          <a href='' onClick={() => this.openCreateNewChatTopic(this.props.activeGroupId)}>
            <span className='glyphicon glyphicon-plus' />
            {' New chat topic'}
          </a>
        </li>
        {topics.map((topic) => {
          let liClass = ''
          if (topic._id === this.state.activeTopicId) {
            liClass = 'active'
          }
          return <li className={liClass} key={'g-chat-c-' + topic._id} onClick={() => this.changeActiveTopic(topic._id)}>
            <a className='g-group-name' href='' data-tooltip={'#' + topic.name}>
              #{topic.name}
            </a>
          </li>
        })}
      </ul>
      <div ref='addChatTopicModal'></div>
    </span>
  }
}

export default composeWithTracker(onPropsChange)(GroupChatChannel)
