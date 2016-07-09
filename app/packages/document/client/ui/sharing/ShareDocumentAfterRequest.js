import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Loader from 'react-loader'
import ReactSelectize from 'react-selectize'
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
    window.alert('approved access for token=' + token + ' accessLevel=' + accessLevel.value)
  }
  rejectAccess () {
    const token = this.props.requestAccessItem.token
    window.alert('rejected access for token=' + token)
  }
  render () {
    const { requestAccessItem } = this.props
    return <div id='share-document-after-request' className='container'>
      {requestAccessItem ? <div className='approval-dialog'>
        <div className='row'>
          <div className='col-lg-12'>
            Would you like to give {requestAccessItem.createdBy} access to the document {requestAccessItem.documentId}?
            <br />
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
