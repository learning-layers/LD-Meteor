import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Loader from 'react-loader'
import { Groups } from '../../lib/collections'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import CreateNewGroupForm from './CreateNewGroupForm'
import ManageGroupMembersModal from '../../../../packages/groups/client/ui/ManageGroupMembersModal'
import { moment } from 'meteor/momentjs:moment'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('groupList')
  let handle2 = Meteor.subscribe('ownGroupsList')
  if (handle.ready() && handle2.ready()) {
    let groups = Groups.find({createdBy: Meteor.userId()}).fetch()
    let ownGroups = Groups.find({'members.userId': Meteor.userId()}).fetch()
    onData(null, {groups, ownGroups})
  }
}

class GroupList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openManageMembersModal: null
    }
  }
  componentWillUnmount () {
    let renderToElement = this.refs.manageMembersModal
    if (this.state.openManageMembersModal !== null) {
      ReactDOM.unmountComponentAtNode(renderToElement)
    }
  }
  deleteGroup (groupId) {
    const group = Groups.findOne({'_id': groupId})
    if (group) {
      const result = global.confirm('Do you really want to delete the group \'' + group.name + '\'')
      if (result) {
        Meteor.call('deleteGroup', groupId)
      }
    }
  }
  leaveGroup (groupId) {
    const group = Groups.findOne({'_id': groupId})
    if (group) {
      const result = global.confirm('Do you really want to leave the group \'' + group.name + '\'')
      if (result) {
        Meteor.call('leaveGroup', groupId)
      }
    }
  }
  openManageMembersModal (groupId) {
    let renderToElement = this.refs.manageMembersModal
    if (!this.state.openManageMembersModal) {
      this.state.openManageMembersModal = ReactDOM.render(<ManageGroupMembersModal groupId={groupId} />, renderToElement)
    } else {
      this.state.openManageMembersModal.open(groupId)
    }
  }
  render () {
    const { groups, ownGroups } = this.props
    const ownUserId = Meteor.userId()
    return <div className='group-list container'>
      <div className='well'>
        <p>Your groups:</p>
        <div ref='manageMembersModal'></div>
        <div className='create-new-group-wrapper'>
          <CreateNewGroupForm />
        </div>
        <div className='table-responsive'>
          <table className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>Team name</th>
                <th>Members</th>
                <th>Creator</th>
                <th>Last update</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => {
                const user = Meteor.users.findOne(group.createdBy)
                const isOwnUser = group.createdBy === ownUserId
                return <tr key={'dli-' + group._id} className='group-list-item'>
                  <td>{group.name}</td>
                  <td>{group.members.length}</td>
                  <td>{user.profile.name}</td>
                  <td>{group.modifiedAt ? moment.max(moment(group.modifiedAt)).fromNow() : null}</td>
                  <td>
                    <ButtonToolbar className='options-buttons'>
                      <Button className='delete-group-button' bsSize='small' onClick={() => this.openManageMembersModal(group._id)}>
                        <span className='glyphicon glyphicon-user' />
                        <span className='glyphicon glyphicon-plus' />
                      </Button>
                      {isOwnUser ? <Button className='delete-doc-button' bsSize='small' onClick={() => this.deleteGroup(group._id)}>
                        <span className='glyphicon glyphicon-trash' />
                      </Button> : null}
                    </ButtonToolbar>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className='well'>
        <p>Groups that you are a member in:</p>
        <div className='table-responsive'>
          <table className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>Team name</th>
                <th>Members</th>
                <th>Creator</th>
                <th>Last update</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {ownGroups.map((group) => {
                const user = Meteor.users.findOne(group.createdBy)
                console.info(Meteor.users.find({}).fetch())
                const isOwnUser = group.createdBy === ownUserId
                return <tr key={'dli-' + group._id} className='group-list-item'>
                  <td>{group.name}</td>
                  <td>{group.members.length}</td>
                  <td>{user && user.profile ? user.profile.name : group.createdBy}</td>
                  <td>{group.modifiedAt ? moment.max(moment(group.modifiedAt)).fromNow() : null}</td>
                  <td>
                    <ButtonToolbar className='options-buttons'>
                      <Button className='delete-group-button' bsSize='small' onClick={() => this.openManageMembersModal(group._id)}>
                        <span className='glyphicon glyphicon-user' />
                        <span className='glyphicon glyphicon-plus' />
                      </Button>
                      {isOwnUser ? <Button className='delete-doc-button' bsSize='small' onClick={() => this.deleteGroup(group._id)}>
                        <span className='glyphicon glyphicon-trash' />
                      </Button> : null}
                      <Button className='leave-group-button' bsSize='small' bsStyle='info' onClick={() => this.leaveGroup(group._id)}>
                        <span className='glyphicon glyphicon-log-out' />{' '}leave
                      </Button>
                    </ButtonToolbar>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(GroupList)
