import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { Groups } from '../../lib/collections'
import { composeWithTracker } from 'react-komposer'
import Loader from 'react-loader'
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
      <AddGroupMember />
      {group.members.length}
      <div className='table-responsive'>
        <table className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>Member name</th>
            </tr>
          </thead>
          <tbody>
            {group.members.map((member) => {
              return <tr key={'gmli-' + member._id} className='member-list-item'>
                <td>{member.profile.name}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(ManageGroupMembers)
