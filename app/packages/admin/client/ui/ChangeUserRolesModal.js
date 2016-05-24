import React, {Component} from 'react'
import {composeWithTracker} from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import Modal from '../../../../../node_modules/react-bootstrap/lib/Modal'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import { UserRoles } from '../../lib/roles'
import classNames from 'classnames'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('user', {userId: props.userId})
  if (handle.ready()) {
    let user = Meteor.users.findOne({'_id': props.userId})
    onData(null, {user})
  }
}

class AvailableRole extends Component {
  render () {
    return <th>{this.props.name}</th>
  }
}

class CoveredRole extends Component {
  toggleRole () {
    if (this.props.covered) {
      Meteor.call('deactivateUserRole', this.props.userId, this.props.internalName);
    } else {
      Meteor.call('activateUserRole', this.props.userId, this.props.internalName);
    }
  }
  render () {
    let roleActivationClasses = classNames({ 'status-indicator-base': true, 'role-active': this.props.covered, 'not-role-active': !this.props.covered })
    return <td className='js-toggle-role'>
      <div className={roleActivationClasses} onClick={() => this.toggleRole()}></div>
    </td>
  }
}

class ChangeUserRolesModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: true,
      roles: []
    }
  }
  componentDidMount () {
    Meteor.call('getRoles', this.props.user._id, (err, res) => {
      if (err) {
        //
      }
      if (res) {
        this.setState({
          roles: res
        })
      }
    })
  }
  close () {
    this.setState({
      showModal: false
    })
  }
  open () {
    this.setState({
      showModal: true
    })
  }
  render () {
    const { user } = this.props
    const roles = this.state.roles
    console.log(roles)

    let roleKeys = null
    if (user.roles) {
      roleKeys = Object.keys(roles)
    } else {
      roleKeys = []
    }
    let roleNames = []
    roleKeys.forEach(function (roleKey) {
      let userRole = user.roles[roleKey]
      let splittedUserRole = userRole.toString().split(',')
      splittedUserRole.forEach(function (splittedUserRoleItem) {
        console.debug(roleKey + '.' + splittedUserRoleItem)
        roleNames.push(roleKey + '.' + splittedUserRoleItem)
      })
    })

    let availableRoles = UserRoles
    let coveredRolesArray = []
    availableRoles.forEach(function (availableRole) {
      if (roleNames.indexOf(availableRole.internal_name) !== -1) {
        coveredRolesArray.push({name: availableRole.name, covered: true, internal_name: availableRole.internal_name})
      } else {
        coveredRolesArray.push({name: availableRole.name, covered: false, internal_name: availableRole.internal_name})
      }
    })

    return <Modal className='change-user-roles-modal' show={this.state.showModal} onHide={() => this.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Edit roles of {user.profile.name} ({user.profile.email})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user._id}
        <table className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              {availableRoles.map(function (availableRole) {
                return <AvailableRole key={availableRole.internal_name}
                  userId={user._id} name={availableRole.name}
                  internalName={availableRole.internal_name} />
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              {coveredRolesArray.map(function (coveredRole) {
                return <CoveredRole key={coveredRole.internal_name}
                  userId={user._id} name={coveredRole.name}
                  covered={coveredRole.covered} internalName={coveredRole.internal_name} />
              })}
            </tr>
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.close()}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}

export default composeWithTracker(onPropsChange)(ChangeUserRolesModal)
