import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import { TimeFromNow } from '../../../../../common/client/ui/util/TimeFromNow'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import FormGroup from '../../../../../../node_modules/react-bootstrap/lib/FormGroup'
import FormControl from '../../../../../../node_modules/react-bootstrap/lib/FormControl'
import Button from '../../../../../../node_modules/react-bootstrap/lib/Button'
import Alert from 'react-s-alert'
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

import { RequestAccessItems } from '../../../lib/sharing/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('requestAccessToDocumentItems', {'documentId': props.documentId})
  if (handle.ready()) {
    let requestAccessItem = RequestAccessItems.findOne({'documentId': props.documentId, 'createdBy': Meteor.userId()})
    onData(null, {requestAccessItem})
  }
}

class RequestAccess extends Component {
  requestAccess (event) {
    event.preventDefault()
    const message = event.target[0].value
    Meteor.call('requestAccessToDocument', this.props.documentId, message, function (err, res) {
      if (err) {
        Alert.error('Sending the request failed:' + err)
      }
      if (res) {
        Alert.success('Sent the request')
      }
    })
  }
  render () {
    const { requestAccessItem } = this.props
    if (requestAccessItem) {
      if (requestAccessItem.result !== null) {
        if (requestAccessItem.result) {
          if (Meteor.isClient) {
            Meteor.setTimeout(function () {
              FlowRouter.reload()
            }, 0)
          }
          return <div className='request-access container'>
            <div className='panel panel-success'>
              <div className='panel-heading'>
                <h4>Access granted</h4>
              </div>
              <div className='panel-body'>
                You are allowed to access this document. Reloading this page...
              </div>
            </div>
          </div>
        } else {
          return <div className='request-access container'>
            <div className='panel panel-danger'>
              <div className='panel-heading'>
                <h4>Access denied</h4>
              </div>
              <div className='panel-body'>
                The owner has denied you access to this document.
              </div>
            </div>
          </div>
        }
      } else {
        return <div className='request-access container'>
          <div className='panel panel-warning'>
            <div className='panel-heading'>
              <h4>Access request pending...</h4>
            </div>
            <div className='panel-body'>
              You notified the owner of the document that you would like to have access to this document.
              Your issued you request to access <TimeFromNow date={requestAccessItem.createdAt} />.
            </div>
          </div>
        </div>
      }
    } else {
      return <div className='container'>
        <div className='request-access container'>
          <div className='panel panel-default'>
            <div className='panel-heading'>
              <h4>Issue a document access request</h4>
            </div>
            <div className='panel-body'>
              {'You currently don\'t have access to this document. You can request access from the owner.'}
              <br /><br />
              <form onSubmit={(event) => this.requestAccess(event)}>
                <FormGroup controlId='requestAccessTextarea'>
                  <FormControl componentClass='textarea' placeholder='Add an additional message to the owner of the document.' />
                </FormGroup>
                <Button type='submit' bsStyle='success'>
                  Request access
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    }
  }
}

RequestAccess.propTypes = {
  documentId: React.PropTypes.string,
  requestAccessItem: React.PropTypes.object
}

export default compose(getTrackerLoader(onPropsChange))(RequestAccess)
