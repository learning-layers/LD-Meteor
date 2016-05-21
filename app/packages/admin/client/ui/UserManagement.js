import React, {Component} from 'react'
import {composeWithTracker} from 'react-komposer'
import {Meteor} from 'meteor/meteor'
import classNames from 'classnames'

let getRoleObjects = function (roles, roleCategory) {
  let roleObjects = []
  let roleObjectsInfos = roles[roleCategory.name]
  if (roleObjectsInfos) {
    roleObjectsInfos.forEach(function (roleObjectsInfo) {
      roleObjects.push({name: roleObjectsInfo})
    })
  }
  return roleObjects
}

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('userList')
  if (handle.ready()) {
    const users = Meteor.users.find({}).fetch()
    onData(null, { users })
  }
}

class User extends Component {
  constructor (props) {
    super(props)
    this.state = {
      registeredEmails: [],
      roles: []
    }
  }

  componentDidMount () {
    Meteor.call('getRegisteredEmails', this.props.user._id, (err, res) => {
      if (err) {
        //
      }
      if (res) {
        this.setState({
          registeredEmails: res
        })
      }
    })
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
  resendVerificationEmail (userId) {
    var result = global.confirm('Do you want to send this user a verification email?')
    if (result) {
      Meteor.call('resendUserVerificationMail', userId)
    }
  }
  render () {
    const { user } = this.props
    let email = user.profile.email
    if (!email) {
      email = 'No email defined!'
    }

    let isVerified = false
    this.state.registeredEmails.forEach(function (registeredEmail) {
      if (registeredEmail.verified) {
        isVerified = true
      }
    })
    let verificationClasses = classNames({ 'status-indicator-base': true, verified: isVerified, 'not-verified': !isVerified })

    let isOnline = user.status.online
    let onlineStatusClasses = classNames({ 'status-indicator-base': true, online: isOnline, 'not-online': !isOnline })

    let roles = this.state.roles
    let roleKeys = Object.keys(roles)
    let roleCategories = []
    roleKeys.forEach(function (roleKey) {
      roleCategories.push({name: roleKey})
    })

    return <tr>
      <td className='user-id'>{user._id}</td>
      <td className='user-email'>{email}</td>
      <td className='user-is-online'>
        <div className={onlineStatusClasses}></div>
      </td>
      <td className='user-verified'>
        {isVerified ? <div className={verificationClasses}></div> : <div>
          <div className={verificationClasses}></div>
          <button className='btn btn-sm btn-default' onClick={() => this.resendVerificationEmail(user._id)}>Resend verification mail</button>
        </div>
        }
      </td>
      <td className='user-roles'>
        <div className='num-of-roles'>
          {roleCategories.length > 0 ? <ol>
            {roleCategories.map(function (roleCategory) {
              let permissions = getRoleObjects(roles, roleCategory)
              return <li key={'roleCategory-' + roleCategory.name}>
                {roleCategory.name}
                <ul>
                  {permissions.map(function (permission) {
                    return <li key={'permission-' + permission.name}>{permission.name}</li>
                  })}
                </ul>
              </li>
            })}
          </ol> : null}
        </div>
        <button className='btn btn-success js-change-user-roles'>Change</button>
      </td>
    </tr>
  }
}

class UserManagement extends Component {
  render () {
    const { users } = this.props
    let isSuperAdmin = true
    return (
      <div className='container'>
        <h2>All users:</h2>
        <div className='table-responsive'>
          <table className='table table-striped table-bordered table-hover'>
            <thead>
            {isSuperAdmin ? <tr>
              <th>userId</th>
              <th>email address</th>
              <th>isOnline</th>
              <th>isVerified</th>
              <th>hasRoles</th>
            </tr> : <tr>
              <th>userId</th>
              <th>email address</th>
              <th>isOnline</th>
            </tr>}
            </thead>
            <tbody>
            {users.map((user) => {
              return <User key={'user-' + user._id} user={user} />
            })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(UserManagement)
