import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Loader from 'react-loader'
import { moment } from 'meteor/momentjs:moment'
import { RequestAccessItems } from '../../../lib/sharing/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('requestAccessToDocumentItems', {'documentId': props.documentId})
  if (handle.ready()) {
    let requestAccessItem = RequestAccessItems.findOne({'documentId': props.documentId, 'createdBy': Meteor.userId()})
    onData(null, {requestAccessItem})
  }
}

class RequestAccess extends Component {
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
    const { requestAccessItem } = this.props
    if (requestAccessItem) {
      if (requestAccessItem.result) {
        if (requestAccessItem.result === 'success') {
          return <div className='request-access container'>
            You are allowed to access this document. Reloading this page...
          </div>
        } else {
          return <div className='request-access container'>
            The owner has denied you access to this document.
          </div>
        }
      } else {
        return <div className='request-access container'>
          You notified the owner of the document that you would like to have access to this document.
          Your issued you request to access {moment.max(moment(requestAccessItem.createdAt).fromNow())}.
        </div>
      }
    } else {
      return <div className='request-access container'>
        You currently don't have access to this document. You can request access from the owner.
        <button className='btn btn-default' onClick={() => this.requestAccess()}>
          Request access
        </button>
      </div>
    }
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(RequestAccess)
