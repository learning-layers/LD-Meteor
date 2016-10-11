import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import Modal from '../../../../../../../node_modules/react-bootstrap/lib/Modal'
import Button from '../../../../../../../node_modules/react-bootstrap/lib/Button'
import ContentEditor from './ContentEditor'
import EventEmitterInstance from '../../../../../../common/client/EventEmitter'

class FullScreenEditorModal extends Component {
  constructor (props) {
    super(props)
    EventEmitterInstance.emit('fullscreen-editor-action', 'open')
    this.state = {
      showModal: true,
      document: props.document,
      permissionLevel: props.permissionLevel
    }
  }
  close () {
    this.setState({
      showModal: false
    })
    Meteor.setTimeout(function () {
      EventEmitterInstance.emit('fullscreen-editor-action', 'close')
    }, 150)
  }
  open (document, permissionLevel) {
    EventEmitterInstance.emit('fullscreen-editor-action', 'open')
    this.setState({
      showModal: true,
      document: document,
      permissionLevel: permissionLevel
    })
  }
  render () {
    return <Modal id='fullscreen-editor' show={this.state.showModal} onHide={() => this.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Fullscreen Editor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.state.showModal ? <ContentEditor document={this.state.document} permissionLevel={this.state.permissionLevel} isFullscreenEditor /> : null}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.close()}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}

export default FullScreenEditorModal
