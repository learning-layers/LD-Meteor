import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import { Groups } from '../../../groups/lib/collections'
import GroupChatChannel from './GroupChatChannel'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('groups')
  if (handle.ready()) {
    const groups = Groups.find({}).fetch()
    onData(null, { groups })
  }
}

class GroupChatGroups extends Component {
  constructor (props) {
    super(props)
    if (props.groups.length > 0) {
      this.state = {
        activeGroupId: props.groups[0]._id
      }
    } else {
      this.state = {
        activeGroupId: null
      }
    }
  }
  changeActiveGroups (groupId) {
    this.setState({activeGroupId: groupId})
  }
  render () {
    const { groups } = this.props
    return <div id='g-group-chat-groups' className='g-aside g-aside-1'>
      <div className='g-groups-area'>
        <ul className='g-group-list'>
          {groups.map((group) => {
            return <li key={'g-chat-g-' + group._id} onClick={() => this.changeActiveGroups(group._id)}>
              <a className='g-group-name' href='' data-tooltip={group.name}>
                {group.name}
              </a>
            </li>
          })}
        </ul>
      </div>
      <div className='g-channel-area'>
        {this.state.activeGroupId ? <GroupChatChannel activeGroupId={this.state.activeGroupId} /> : null}
      </div>
    </div>
  }
}

export default composeWithTracker(onPropsChange)(GroupChatGroups)
