import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'

export class RequestAccess extends Component {
  requestAccess () {
    Meteor.call('requestAccessToDocument', this.props.documentId, function (err, res) {
      if (err) {
        window.alert(JSON.stringify(err))
      }
      if (res) {
        window.alert(JSON.stringify(res))
      }
    })
  }
  render () {
    return <div className='request-access container'>
      You currently don't have access to this document. You can request access from the owner.
      <button className='btn btn-default' onClick={() => this.requestAccess()}>
        Request access
      </button>
      <button className='btn btn-default' onClick={() => window.location.reload()}>
        Reload the page
      </button>
    </div>
  }
}
