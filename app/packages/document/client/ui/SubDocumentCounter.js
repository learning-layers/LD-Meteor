import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import { Counts } from 'meteor/tmeasday:publish-counts'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import Badge from '../../../../../node_modules/react-bootstrap/lib/Badge'
import EventEmitterInstance from '../../../../common/client/EventEmitter'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('subdocumentCount', {parentId: props.documentId})
  if (handle.ready()) {
    const subdocumentsCount = Counts.get('subdocumentCount')
    onData(null, { subdocumentsCount })
  }
}

class SubDocumentCounter extends Component {
  toggleSubDocumentArea () {
    EventEmitterInstance.emit('doc-toggle-subdocs', false)
  }
  render () {
    const { subdocumentsCount } = this.props
    return <Button className='subdocument-toggle' bsSize='small' onClick={() => this.toggleSubDocumentArea()}>
      <span className='glyphicon glyphicon-duplicate' />
      <Badge>{subdocumentsCount}</Badge>
    </Button>
  }
}

SubDocumentCounter.propTypes = {
  subdocumentsCount: React.PropTypes.number
}

export default composeWithTracker(onPropsChange)(SubDocumentCounter)
