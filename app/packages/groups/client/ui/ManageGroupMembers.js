import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { Groups } from '../../lib/collections'
import { compose } from 'react-komposer'
import AddGroupMember from './AddGroupMember'
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
  let handle = Meteor.subscribe('groupMemberList', {groupId: props.groupId})
  if (handle.ready()) {
    let group = Groups.findOne({'_id': props.groupId})
    onData(null, {group})
  }
}

class ManageGroupMembers extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: true,
      groupId: this.props.groupId
    }
  }
  removeMemberFromGroup (userId) {
    Meteor.call('removeUserFromGroup', this.state.groupId, userId)
  }
  render () {
    const { group } = this.props
    return <div className='manage-group-members'>
      <AddGroupMember groupId={this.state.groupId} groupMembers={[]} />
      <ul>
        {group.members.map((member) => {
          const user = Meteor.users.findOne({'_id': member.userId})
          if (!user) {
            // retrieve user info via sync method
            console.log(member.userId)
          }
          const label = user ? user.profile.name : member.userId
          return <li>{label} - <button className='btn btn-danger' onClick={() => this.removeMemberFromGroup(member.userId)}>Remove</button></li>
        })}
      </ul>
    </div>
  }
}

ManageGroupMembers.propTypes = {
  groupId: React.PropTypes.string,
  group: React.PropTypes.object
}

export default compose(getTrackerLoader(onPropsChange))(ManageGroupMembers)
