import React, {Component, PropTypes} from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import { Counts } from 'meteor/tmeasday:publish-counts'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import Badge from '../../../../../node_modules/react-bootstrap/lib/Badge'
import EventEmitterInstance from '../../../../common/client/EventEmitter'
import { Tracker } from 'meteor/tracker'
import _throttle from 'lodash/throttle'

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
  let handle = Meteor.subscribe('subdocumentCount', {parentId: props.documentId})
  if (handle.ready()) {
    const subdocumentsCount = Counts.get('subdocumentCount')
    onData(null, { subdocumentsCount })
  }
}

function openSubDocs (open) {
  EventEmitterInstance.emit('doc-open-subdocs', open)
}

const throttledOpenSubDocs = _throttle(openSubDocs, 500)

let lastDocumentIdChange = new Date()

class SubDocumentCounter extends Component {
  componentDidMount () {
    if (this.props.subdocumentsCount > 0) {
      throttledOpenSubDocs(true)
    }
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.documentId !== nextProps.documentId) {
      lastDocumentIdChange = new Date()
      this.props.updateSubDocumentsCount(nextProps.subdocumentsCount)
    } else if (this.props.subdocumentsCount !== nextProps.subdocumentsCount) {
      const timeDiff = Math.abs(new Date().getTime() - lastDocumentIdChange.getTime())
      if (timeDiff < 1500) {
        this.props.updateSubDocumentsCount(nextProps.subdocumentsCount)
      }
    }
  }
  toggleSubDocumentArea () {
    EventEmitterInstance.emit('doc-toggle-subdocs', false)
  }
  render () {
    const { subdocumentsCount } = this.props
    return <Button className='subdocument-toggle' bsSize='small' onClick={() => this.toggleSubDocumentArea()} data-tooltip='Subdocs'>
      <span className='glyphicon glyphicon-duplicate' />
      <Badge>{subdocumentsCount}</Badge>
    </Button>
  }
}

SubDocumentCounter.propTypes = {
  documentId: PropTypes.string.isRequired,
  subdocumentsCount: PropTypes.number,
  updateSubDocumentsCount: PropTypes.func.isRequired
}

export default compose(getTrackerLoader(onPropsChange))(SubDocumentCounter)
