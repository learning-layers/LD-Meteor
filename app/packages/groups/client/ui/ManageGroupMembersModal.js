import React, {Component} from 'react'
import Modal from '../../../../../node_modules/react-bootstrap/lib/Modal'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import ManageGroupMembers from './ManageGroupMembers'

class ManageGroupMembersModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: true,
      groupId: this.props.groupId
    }
  }
  open (groupId) {
    this.setState({
      showModal: true,
      groupId: groupId
    })
  }
  close () {
    this.setState({
      showModal: false
    })
  }
  render () {
    const { groupId } = this.state
    return <Modal className='manage-group-members-modal' show={this.state.showModal} onHide={() => this.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Manage Group Members</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ManageGroupMembers groupId={groupId} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.close()}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}

ManageGroupMembersModal.propTypes = {
  groupId: React.PropTypes.string
}

export default ManageGroupMembersModal
