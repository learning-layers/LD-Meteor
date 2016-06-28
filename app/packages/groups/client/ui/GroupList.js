import React, { Component } from 'react'
import Loader from 'react-loader'
import { Groups } from '../../lib/collections'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import CreateNewGroupForm from './CreateNewGroupForm'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('groupList')
  if (handle.ready()) {
    let groups = Groups.find({createdBy: Meteor.userId()}).fetch()
    onData(null, {groups})
  }
}

class GroupList extends Component {
  deleteGroup (groupId) {
    const group = Groups.findOne({'_id': groupId})
    if (group) {
      const result = global.confirm('Do you really want to delete the group \'' + group.name + '\'')
      if (result) {
        Meteor.call('deleteGroup', groupId)
      }
    }
  }
  render () {
    const { groups } = this.props
    const ownUserId = Meteor.userId()
    return <div className='group-list container'>
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
              const isOwnUser = document.createdBy === ownUserId
              return <tr key={'dli-' + group._id} className='group-list-item'>
                <td>{group.name}</td>
                <td>#members</td>
                <td>{user.profile.name}</td>
                <td>{group.modifiedAt}</td>
                <td>
                  <ButtonToolbar className='options-buttons'>
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
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(GroupList)
