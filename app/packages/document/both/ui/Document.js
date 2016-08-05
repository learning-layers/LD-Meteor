import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import NotFound from '../../../../common/both/ui/mainLayout/NotFound'
import { Documents, DocumentAccess } from '../../lib/collections'
import RequestAccess from './sharing/RequestAccess'
import AccessForbidden from '../../../../common/both/ui/mainLayout/AccessForbidden'
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
  let subscribe = function () {
    let argumentsArray = [].splice.call(arguments, 0)
    let args = argumentsArray.concat([{
      onError: function (err) {
        console.log(JSON.stringify(err))
        if (err && err.error !== 401 && err.error !== 403 && err.error !== 404) {
          // don't call onData
          console.log(err.error)
        } else {
          onData(null, { err: err })
        }
      }
    }])
    return Meteor.subscribe.apply(Meteor, args)
  }
  let subscribeServer = function () {
    return Meteor.subscribe.apply(Meteor, arguments)
  }
  if (props.action && props.action === 'shared' && props.permission && props.accessKey) {
    let handle = subscribe('document', { id: props.id, action: props.action, permission: camelCase('can_' + props.permission), accessKey: props.accessKey })
    if (handle.ready()) {
      let document = Documents.findOne({ '_id': props.id })
      if (document === undefined && Meteor.isServer) {
        let handleServer = subscribeServer('document', { id: props.id, action: props.action, permission: camelCase('can_' + props.permission), accessKey: props.accessKey })
        if (handleServer.ready()) {
          document = Documents.findOne({ '_id': props.id })
          let documentAccess = DocumentAccess.findOne({documentId: props.id})
          onData(null, { document, documentAccess })
        }
      } else {
        let documentAccess = DocumentAccess.findOne({documentId: props.id})
        onData(null, { document, documentAccess })
      }
    } else {
      let loading = true
      let document = Documents.findOne({ '_id': props.id })
      let documentAccess = DocumentAccess.findOne({documentId: props.id})
      onData(null, { document, documentAccess, loading })
    }
  } else {
    let handle = subscribe('document', { id: props.id })
    if (handle.ready()) {
      let document = Documents.findOne({ '_id': props.id })
      if (document === undefined && Meteor.isServer) {
        let handleServer = subscribeServer('document', { id: props.id })
        if (handleServer.ready()) {
          document = Documents.findOne({ '_id': props.id })
          let documentAccess = DocumentAccess.findOne({documentId: props.id})
          onData(null, { document, documentAccess })
        }
      } else {
        let documentAccess = DocumentAccess.findOne({documentId: props.id})
        onData(null, { document, documentAccess })
      }
    } else {
      let loading = true
      let document = Documents.findOne({ '_id': props.id })
      let documentAccess = DocumentAccess.findOne({documentId: props.id})
      onData(null, { document, documentAccess, loading })
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
  componentDidMount () {
    const { action, permission, accessKey } = this.props
    if (action === 'shared' && (permission === 'edit' || permission === 'comment') && accessKey) {
      Meteor.setTimeout(() => {
        this.assignEditOrCommentPermissions()
      }, 0)
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
    const { err, action, permission, accessKey, loading } = this.props
    let { document, documentAccess } = this.props
    if (err && err.error === 403) {
      return <div className='container'>
        <RequestAccess documentId={this.props.id} />
      </div>
    } else if (err && err.error === 401) {
      return <AccessForbidden />
    } else if (err && err.error === 404) {
      return <NotFound />
    } else {
      if (action === 'shared' && (permission === 'edit' || permission === 'comment') && accessKey) {
        return <div className='container'>
          {'Assigning new permissions ...'}
        </div>
      } else if (loading) {
        return <div className='container'>
          Loading...
        </div>
      }
      return <DocumentDisplay document={document} documentAccess={documentAccess} action={action} permission={permission} accessKey={accessKey} />
    }
  }
}

Document.propTypes = {
  id: React.PropTypes.string,
  document: React.PropTypes.object,
  documentAccess: React.PropTypes.object,
  err: React.PropTypes.object,
  action: React.PropTypes.string,
  permission: React.PropTypes.string,
  accessKey: React.PropTypes.string,
  loading: React.PropTypes.bool
}

export default composeWithTracker(onPropsChange)(Document)
