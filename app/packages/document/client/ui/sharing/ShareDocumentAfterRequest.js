import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import ReactSelectize from 'react-selectize'
import Alert from 'react-s-alert'
import { RequestAccessItems } from '../../../lib/sharing/collections'
import { Documents } from '../../../lib/collections'
const SimpleSelect = ReactSelectize.SimpleSelect
import { Tracker } from 'meteor/tracker'

function getTrackerLoader (reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env)
      })
    })

    return () => {
      if (typeof trackerCleanup === 'function') trackerCleanup()
      return handler.stop()
    }
  }
}

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('requestAccessToDocumentItems', {'token': props.token})
  if (handle.ready()) {
    let requestAccessItem = RequestAccessItems.findOne({'token': props.token, 'owner': Meteor.userId()})
    onData(null, {requestAccessItem})
  }
}

class ShareDocumentAfterRequest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sharingOptions: [
        {label: 'Can Edit', value: 'CanEdit'},
        {label: 'Can Comment', value: 'CanComment'},
        {label: 'Can View', value: 'CanView'}
      ]
    }
  }
  approveAccess () {
    const token = this.props.requestAccessItem.token
    const accessLevel = this.refs.permissionSelection.state.value
    console.log('approved access for token=' + token + ' accessLevel=' + accessLevel.value)
    function camelCase (input) {
      if (input.length > 0) {
        var oldInput = input.substring(1)
        var newfirstletter = input.charAt(0)
        input = newfirstletter.toUpperCase() + oldInput
        return input.replace(/_(.)/g, function (match, group1) {
          return group1.toUpperCase()
        })
      } else {
        return input
      }
    }
    Meteor.call('addDocumentUserAccessAfterRequest', this.props.requestAccessItem.documentId, this.props.requestAccessItem.createdBy, camelCase(accessLevel.value), (err, res) => {
      if (err) {
        Alert.error('Error: Sharing the document with user \'' + this.props.requestAccessItem.createdBy + '.')
      }
      if (res) {
        Alert.success('Success: Sharing the document.')
      }
    })
  }
  rejectAccess () {
    const token = this.props.requestAccessItem.token
    console.log('rejected access for token=' + token)
    Meteor.call('rejectDocumentUserAccessAfterRequest', this.props.requestAccessItem.token)
  }
  render () {
    const { requestAccessItem } = this.props
    let username = ''
    let documentName = ''
    if (requestAccessItem) {
      const user = Meteor.users.findOne({_id: requestAccessItem.createdBy})
      if (user && user.profile) {
        username = user.profile.name
      } else {
        username = requestAccessItem.createdBy
      }
      let document = Documents.findOne({_id: requestAccessItem.documentId})
      if (document) {
        documentName = document.title
      } else {
        documentName = requestAccessItem.documentId
      }
    }
    return <div id='share-document-after-request' className='container'>
      {requestAccessItem ? <div className='approval-dialog'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='panel panel-default'>
              <div className='panel-heading'>
                <h4>Answer the document access request</h4>
              </div>
              <div className='panel-body'>
                Would you like to give {username} access to the document {documentName}?
                <br />
                {requestAccessItem.message ? <div>
                  There is also a message from the user:
                  <br /><br />
                  "{requestAccessItem.message}"
                  <br />
                </div> : null}
                Select the access permission that the user should get:
                <SimpleSelect
                  className='access-select'
                  ref='permissionSelection'
                  options={this.state.sharingOptions}
                  defaultValue={{label: 'Can Edit', value: 'can_edit'}}
                  placeholder='Select a permission'
                  theme='material'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='well'>
              {requestAccessItem.result ? <div className='alert alert-success'>You have approved the access to the document for user {username}</div> : <div className='access-request-result-neg'>
                {requestAccessItem.result === null ? null : <div className='alert alert-danger'>
                  You have denied the access to the document for user {username}
                </div>}
              </div>}
              <br />
              {!requestAccessItem.result ? (
                <button className='btn btn-success' onClick={() => this.approveAccess()}>
                  Approve access
                </button>
              ) : null}
              {requestAccessItem.result === null || requestAccessItem.result === true ? (
                <button className='btn btn-info' onClick={() => this.rejectAccess()}>
                  Reject access
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div> : 'There is no access request for you at this address.'}
    </div>
  }
}

ShareDocumentAfterRequest.propTypes = {
  requestAccessItem: React.PropTypes.object
}

export default compose(getTrackerLoader(onPropsChange))(ShareDocumentAfterRequest)
