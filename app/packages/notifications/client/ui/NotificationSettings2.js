import React, {Component} from 'react'

class NotificationSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return <div className='notification-settings container'>
      <h3>Documents</h3>
      <hr />
      <table className='table table-bordered table-striped table-hover table-condensed'>
        <thead>
          <tr>
            <th>in-app</th>
            <th>email</th>
            <th>off</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Checkbox</td><td>Checkbox</td><td>Checkbox</td></tr>
        </tbody>
      </table>
      <h3>Document subscriptions</h3>
      <hr />
      <table className='table table-bordered table-striped table-hover table-condensed'>
        <thead>
          <tr>
            <th>in-app</th>
            <th>email</th>
            <th>off</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
            </td>
            <td>
            </td>
            <td>
            </td>
          </tr>
        </tbody>
      </table>
      <h3>Chat</h3>
      <hr />
      <h4>Direct chat (one-to-one, Friendlist)</h4>
      <h4>Group chat</h4>
    </div>
  }
}

export default NotificationSettings
