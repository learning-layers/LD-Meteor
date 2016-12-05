import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import { Groups } from '../../../groups/lib/collections'
import GroupChatChannel from './GroupChatChannel'
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
  let handle = Meteor.subscribe('groups')
  if (handle.ready()) {
    const groups = Groups.find({}).fetch()
    onData(null, { groups })
  }
}

class GroupChatGroups extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false
    }
    if (props.groups.length > 0) {
      this.state.activeGroupId = props.groups[0]._id
    } else {
      this.state.activeGroupId = null
    }
  }
  changeActiveGroup (groupId) {
    this.setState({activeGroupId: groupId})
  }
  toggleChatGroupsSidebar () {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  render () {
    const { groups } = this.props
    const activeGroup = Groups.findOne({_id: this.state.activeGroupId})
    let groupChatGroupsClasses = 'g-aside g-aside-1'
    if (this.state.collapsed) {
      groupChatGroupsClasses += ' collapsed'
    }
    return <div id='g-group-chat-groups' className={groupChatGroupsClasses}>
      {!this.state.collapsed ? <div className='g-scroll'>
        <div className='g-groups-area'>
          <ul className='g-group-list'>
            {groups.map((group) => {
              let liClass = ''
              if (group._id === this.state.activeGroupId) {
                liClass = 'active'
              }
              return <li className={liClass} key={'g-chat-g-' + group._id} onClick={() => this.changeActiveGroup(group._id)}>
                <a className='g-group-name' href='' data-tooltip={group.name}>
                  {group.name}
                </a>
              </li>
            })}
          </ul>
          {groups.length === 0 ? <span style={{fontSize: '12px'}}>
            <p>You are currently not a member in any group. Either create a group or let someone invite you to a group.</p>
            <p>You can manage your groups here: <a href='/groupList'>Manage Groups</a></p>
          </span> : null}
        </div>
        <div className='g-channel-area'>
          {this.state.activeGroupId ? <GroupChatChannel groupName={activeGroup.name} activeGroupId={activeGroup._id} /> : null}
        </div>
      </div> : <div className='channels'>
        <div style={{display: 'block', marginLeft: '-3px'}}>
          <span className='glyphicon glyphicon-comment' style={{marginRight: '5px'}} />
        </div>
        &nbsp;
        Chat&nbsp;channels
      </div>}
      <div className='g-close-handle' onClick={() => this.toggleChatGroupsSidebar()}>
        {!this.state.collapsed ? <span className='glyphicon glyphicon-chevron-left' /> : <span className='glyphicon glyphicon-chevron-right' />}
      </div>
    </div>
  }
}

export default compose(getTrackerLoader(onPropsChange))(GroupChatGroups)
