import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Loader from 'react-loader'
import ReactSelectize from 'react-selectize'
import Alert from 'react-s-alert'
import { RequestAccessItems } from '../../../lib/sharing/collections'
const SimpleSelect = ReactSelectize.SimpleSelect

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
    console.debug('approved access for token=' + token + ' accessLevel=' + accessLevel.value)
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
    console.debug('rejected access for token=' + token)
  }
  render () {
    const { requestAccessItem } = this.props
    return <div id='share-document-after-request' className='container'>
      {requestAccessItem ? <div className='approval-dialog'>
        <div className='row'>
          <div className='col-lg-12'>
            Would you like to give {requestAccessItem.createdBy} access to the document {requestAccessItem.documentId}?
            <br />
            {requestAccessItem.message ? <div>
              There is also a message from the user:
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
        <div className='row'>
          <div className='col-lg-12'>
            <br />
            <button className='btn btn-success' onClick={() => this.approveAccess()}>
              Approve access
            </button>
            <button className='btn btn-info' onClick={() => this.rejectAccess()}>
              Reject access
            </button>
          </div>
        </div>
      </div> : 'There is no access request for you at this address.'}
    </div>
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(ShareDocumentAfterRequest)
