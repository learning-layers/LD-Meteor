import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import NotFound from '../../../../common/client/ui/mainLayout/NotFound'
import { Documents, DocumentAccess } from '../../lib/collections'
import RequestAccess from './sharing/RequestAccess'
import AccessForbidden from '../../../../common/client/ui/mainLayout/AccessForbidden'
import DocumentDisplay from './DocumentDisplay'
import { getDocument } from '../../lib/methods'
import { Tracker } from 'meteor/tracker'
import { setUpAssignNewPermissionsInterval } from '../api/sharing'
import OldSharingLink from './sharing/OldSharingLink'
const getDocumentSync = Meteor.wrapAsync(getDocument)

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

function camelCase (input) {
  if (input.length > 0) {
    const oldInput = input.substring(1)
    const newfirstletter = input.charAt(0)
    input = newfirstletter.toUpperCase() + oldInput
    return input.replace(/_(.)/g, function (match, group1) {
      return group1.toUpperCase()
    })
  } else {
    return input
  }
}

let propsLastChangedAt = new Date()
function onPropsChange (props, onData) {
  propsLastChangedAt = new Date()
  let args
  if (props.action && props.action === 'shared' && props.permission && props.accessKey) {
    args = { id: props.id, action: props.action, permission: camelCase('can_' + props.permission), accessKey: props.accessKey }
  } else {
    args = { id: props.id }
  }
  let handle = Meteor.subscribe('document', args, {
    onError: function (err) {
      // If any errors occur rerender the site:
      // For instance if a 403 error occurs with the message 'No access to this document'
      // then a request for access form is displayed to the user if logged out.
      onData(null, { documentId: props.id, err: err })
    }
  })
  if (handle.ready()) {
    let document = Documents.findOne({ '_id': props.id })
    let documentAccess = DocumentAccess.findOne({documentId: props.id})
    if (!document) { //  && Meteor.isServer
      // check what the reason is
      if (args.accessKey) {
        document = getDocumentSync(props.id, props.action, props.permission, props.accessKey)
        onData(null, { documentId: props.id, document, documentAccess })
      } else {
        document = getDocumentSync(props.id, undefined, undefined, undefined)
        onData(null, { documentId: props.id, document, documentAccess })
      }
    } else {
      onData(null, { documentId: props.id, document, documentAccess })
    }
  } else {
    let document = Documents.findOne({ '_id': props.id })
    let documentAccess = DocumentAccess.findOne({documentId: props.id})
    onData(null, { documentId: props.id, document, documentAccess })
  }
}

class Document extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null
    }
  }
  propsWillChange (nextProps) {
    if (nextProps.action) {
      if (this.assignNewPermissionsInterval) {
        Meteor.clearInterval(this.assignNewPermissionsInterval)
      }
      setUpAssignNewPermissionsInterval(this, (err) => {
        // TODO comment this in a better way
        console.log(err)
      })
    }
  }
  componentDidMount () {
    if (this.props.action) {
      setUpAssignNewPermissionsInterval(this, (err) => {
        // TODO comment this in a better way
        console.log(err)
      })
    }
  }
  render () {
    const { err, action, permission, accessKey } = this.props
    let { document, documentAccess } = this.props
    this.state.isScheduledForReload = false
    console.log('err=', err)
    console.log('document=', document)
    if (err && err.error === 403) {
      if (err.reason === 'No access to this document') {
        return <RequestAccess documentId={this.props.documentId} />
      } else {
        return <OldSharingLink documentId={this.props.documentId} />
      }
    } else if (err && err.error === 401) {
      return <AccessForbidden />
    } else if (err && err.error === 404) {
      return <NotFound />
    } else if (err) {
      console.error(err)
      return <NotFound />
    } else {
      if (action === 'shared' && (permission === 'edit' || permission === 'comment') && accessKey) {
        return <div className='container'>
          {'Assigning new permissions ...'}
        </div>
      } else if (!document) {
        console.debug('document not found')
        const timeDiff = Math.abs(new Date().getTime() - propsLastChangedAt.getTime())
        const diffSeconds = Math.ceil(timeDiff / 1000)
        if (diffSeconds < 3) { // TODO check if this is currently in use
          this.state.isScheduledForReload = true
          Meteor.setTimeout(() => {
            if (this.state.isScheduledForReload) {
              this.state.isScheduledForReload = false
              this.setState({})
            }
          }, 1000)
          return <div className='container'>
            Loading...
          </div>
        } else {
          return <div>{JSON.stringify(err)}{JSON.stringify(document)}<NotFound /></div>
        }
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

export default compose(getTrackerLoader(onPropsChange))(Document)
