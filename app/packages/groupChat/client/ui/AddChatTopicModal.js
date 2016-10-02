import React, { Component } from 'react'
import Modal from '../../../../../node_modules/react-bootstrap/lib/Modal'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import CreateNewChatTopicForm from './CreateNewChatTopicForm'

class AddChatTopicModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: true,
      groupId: props.activeGroupId
    }
  }
  close () {
    this.setState({
      showModal: false,
      groupId: null
    })
  }
  open (groupId) {
    this.setState({
      showModal: true,
      groupId: groupId
    })
  }
  render () {
    return <Modal className='add-friend-modal' show={this.state.showModal} onHide={() => this.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Add a new chat topic</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreateNewChatTopicForm groupId={this.state.groupId} closeModalFunc={() => this.close()} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.close()}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}

export default AddChatTopicModal
