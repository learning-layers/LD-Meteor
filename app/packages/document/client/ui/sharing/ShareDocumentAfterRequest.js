import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Loader from 'react-loader'
import { RequestAccessItems } from '../../../lib/sharing/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('requestAccessToDocumentItems', {'token': props.token})
  if (handle.ready()) {
    let requestAccessItem = RequestAccessItems.findOne({'token': props.token, 'owner': Meteor.userId()})
    onData(null, {requestAccessItem})
  }
}

class ShareDocumentAfterRequest extends Component {
  // {this.props.token ? this.props.token : null}
  render () {
    const { requestAccessItem } = this.props
    return <div id='share-document-after-request' className='container'>
      {JSON.stringify(requestAccessItem)}
    </div>
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(ShareDocumentAfterRequest)
