import React, {Component} from 'react'
import {composeWithTracker} from 'react-komposer'
import {Meteor} from 'meteor/meteor'

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
      registeredEmails: []
    }
  }

  componentDidMount () {
    Meteor.call('getRegisteredEmails', this.props.user._id, function (err, res) {
      if (err) {
        //
      }
      if (res) {
        this.setState({
          registeredEmails: res
        })
      }
    })
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
    let isVerifiedStyle = {
      backgroundColor: 'lightgreen',
      borderRadius: '50%',
      height: '15px',
      width: '15px'
    }
    let isNotVerifiedStyle = {
      backgroundColor: 'lightsalmon',
      borderRadius: '50%',
      height: '15px',
      width: '15px'
    }
    let isOnline = user.status.online
    return (
      <tr>
        <td class='user-id'>{user._id}</td>
        <td class='user-email'>{email}</td>
        <td class='user-is-online'>
          {isOnline ? <div style={isVerifiedStyle}></div> : <div style={isNotVerifiedStyle}></div>}
        </td>
        <td class='user-verified'>
          {isVerified ? <div style={isVerifiedStyle}></div> : <div>
            <div style={isNotVerifiedStyle}></div>
            <button class='btn btn-sm btn-default js-send-verification-mail'>Resend verification mail</button>
          </div>
          }
        </td>
        <td class='user-roles'>
          <div class='num-of-roles'>
            <ol>
            </ol>
          </div>
          <button class='btn btn-success js-change-user-roles'>Change</button>
        </td>
      </tr>
    )
  }
}

class UserManagement extends Component {
  render () {
    const { users } = this.props
    let isSuperAdmin = true
    return (
      <div class='container'>
        <h2>All users:</h2>
        <div class='table-responsive'>
          <table class='table table-striped table-bordered table-hover'>
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
              return <User user={user} />
            })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(UserManagement)
