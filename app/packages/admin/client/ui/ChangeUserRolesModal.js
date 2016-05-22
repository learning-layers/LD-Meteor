import React, {Component} from 'react'
import {composeWithTracker} from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import Modal from '../../../../../node_modules/react-bootstrap/lib/Modal'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('user', {userId: props.userId})
  if (handle.ready()) {
    let user = Meteor.users.findOne({'_id': props.userId})
    onData(null, {user})
  }
}

class ChangeUserRolesModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: true,
      roles: []
    }
  }
  componentDidMount () {
    Meteor.call('getRoles', this.props.user._id, (err, res) => {
      if (err) {
        //
      }
      if (res) {
        this.setState({
          roles: res
        })
      }
    })
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
    const { user } = this.props
    const roles = this.state.roles
    console.log(roles)
    return <Modal className='change-user-roles-modal' show={this.state.showModal} onHide={() => this.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Edit roles of {user.profile.name} ({user.profile.email})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user._id}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.close()}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}

export default composeWithTracker(onPropsChange)(ChangeUserRolesModal)
