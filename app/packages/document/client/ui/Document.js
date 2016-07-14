import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Loader from 'react-loader'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import NotFound from '../../../../common/client/ui/mainLayout/NotFound'
import { Documents } from '../../lib/collections'
import RequestAccess from './sharing/RequestAccess'
import AccessForbidden from '../../../../common/client/ui/mainLayout/AccessForbidden'
import DocumentDisplay from './DocumentDisplay'

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

function onPropsChange (props, onData) {
  if (props.action && props.action === 'shared' && props.permission && props.accessKey) {
    let handle = Meteor.subscribe('document', { id: props.id, action: props.action, permission: camelCase('can_' + props.permission), accessKey: props.accessKey }, {
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
  constructor (props) {
    super(props)
    this.state = {
      error: null
    }
  }
  assignEditOrCommentPermissions () {
    let permission = this.props.permission
    permission = 'can_' + permission
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
    Meteor.call('assignDocumentEditOrCommentPermissions', this.props.document._id, camelCase(permission), this.props.accessKey, (err, res) => {
      if (err) {
        window.alert(err)
      }
      if (res) {
        FlowRouter.go('/document/' + this.props.document._id)
      } else {
        window.alert('failed')
      }
    })
  }
  render () {
    const { document, err, action, permission, accessKey } = this.props
    console.debug(JSON.stringify(document), JSON.stringify(err), JSON.stringify(action), JSON.stringify(permission), JSON.stringify(accessKey))
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
      } else {
        return <NotFound />
      }
    } else {
      if (action === 'shared' && (permission === 'edit' || permission === 'comment') && accessKey) {
        Meteor.setTimeout(() => {
          this.assignEditOrCommentPermissions()
        }, 0)
        return <div className='container'>
          Assigning new permissions ...
        </div>
      }
      return <DocumentDisplay document={document} action={action} permission={permission} accessKey={accessKey} />
    }
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(Document)
