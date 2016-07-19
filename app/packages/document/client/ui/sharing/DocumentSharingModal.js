import React, {Component} from 'react'
import Modal from '../../../../../../node_modules/react-bootstrap/lib/Modal'
import Button from '../../../../../../node_modules/react-bootstrap/lib/Button'
import DocumentSharing from './DocumentSharing'

class DocumentSharingModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: true
    }
  }
  open (groupId) {
    this.setState({
      showModal: true
    })
  }
  close () {
    this.setState({
      showModal: false
    })
  }
  render () {
    const { documentId } = this.props
    return <Modal className='document-sharing-modal' show={this.state.showModal} onHide={() => this.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Share this document with others</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DocumentSharing documentId={documentId} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.close()}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}

DocumentSharingModal.propTypes = {
  documentId: React.PropTypes.string
}

export default DocumentSharingModal
