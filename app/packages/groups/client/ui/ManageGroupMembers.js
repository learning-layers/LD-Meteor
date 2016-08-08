import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { Groups } from '../../lib/collections'
import { composeWithTracker } from 'react-komposer'
import AddGroupMember from './AddGroupMember'

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
  render () {
    const { group } = this.props
    return <div className='manage-group-members'>
      <AddGroupMember groupId={this.state.groupId} groupMembers={group.members.map(function (member) {
        const user = Meteor.users.findOne({'_id': member.userId})
        if (!user) {
          // retrieve user info via sync method
          console.log(member.userId)
        }
        const label = user ? user.profile.name : member.userId
        return {label: label, value: member.userId}
      })} />
    </div>
  }
}

ManageGroupMembers.propTypes = {
  groupId: React.PropTypes.string,
  group: React.PropTypes.object
}

export default composeWithTracker(onPropsChange)(ManageGroupMembers)
