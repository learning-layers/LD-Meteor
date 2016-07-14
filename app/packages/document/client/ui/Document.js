import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Loader from 'react-loader'
import NotFound from '../../../../common/client/ui/mainLayout/NotFound'
import { Documents } from '../../lib/collections'
import RequestAccess from './sharing/RequestAccess'
import AccessForbidden from '../../../../common/client/ui/mainLayout/AccessForbidden'
import DocumentDisplay from './DocumentDisplay'

function onPropsChange (props, onData) {
  if (props.action && props.action === 'shared' && props.permission && props.accessKey) {
    let handle = Meteor.subscribe('document', { id: props.id, action: props.action, permission: props.permission, accessKey: props.accessKey }, {
      /* onReady: function () { // TODO cleanup -> find a better solution for reactive updates here
       let document = Documents.findOne({'_id': props.id})
       onData(null, {document})
       },*/
      onError: function (err) {
        onData(null, { err: err })
      }
    })
    if (handle.ready()) {
      let document = Documents.findOne({ '_id': props.id })
      onData(null, { document })
    }
  } else {
    let handle = Meteor.subscribe('document', { id: props.id }, {
      /* onReady: function () { // TODO cleanup -> find a better solution for reactive updates here
       let document = Documents.findOne({'_id': props.id})
       onData(null, {document})
       },*/
      onError: function (err) {
        onData(null, { err: err })
      }
    })
    if (handle.ready()) {
      let document = Documents.findOne({ '_id': props.id })
      onData(null, { document })
    }
  }
}

class Document extends Component {
  render () {
    const { document, err, action, permission, accessKey } = this.props
    if (!document) {
      if (err) {
        if (err.error === 403) {
          return <div className='container'>
            <RequestAccess documentId={this.props.id} />
          </div>
        } else if (err.error === 401) {
          return <AccessForbidden />
        } else {
          return <div className='container'>
            Ooops something went wrong. Please contact the administrator of this website.
          </div>
        }
      } else if (action === 'shared') {
        return <div className='document container-fluid'>'Sharing link action'</div>
      } else {
        return <NotFound />
      }
    } else {
      return <DocumentDisplay document={document} action={action} permission={permission} accessKey={accessKey} />
    }
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(Document)
