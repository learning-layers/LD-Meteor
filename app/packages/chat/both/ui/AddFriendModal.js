import React, {Component} from 'react'
import Modal from '../../../../../node_modules/react-bootstrap/lib/Modal'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'

class AddFriendModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: true
    }
  }
  close () {
    this.setState({
      showModal: false
    })
  }
  open () {
    this.setState({
      showModal: true
    })
  }
  render () {
    return <Modal className='add-friend-modal' show={this.state.showModal} onHide={() => this.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Add a friend</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Add a friend
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.close()}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}

export default AddFriendModal
