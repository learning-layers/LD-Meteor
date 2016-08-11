import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import ReactSelectize from 'react-selectize'
import Alert from 'react-s-alert'
import Modal from '../../../../../node_modules/react-bootstrap/lib/Modal'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
const SimpleSelect = ReactSelectize.SimpleSelect

class AddFriendModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: true,
      options: []
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
  addToFriendList () {
    const userToAdd = this.refs.userSelection.state.value
    Meteor.call('sendFriendRequest', userToAdd.value, (err, res) => {
      if (err) {
        Alert.error('Error adding ' + userToAdd.label + ' to your friendlist')
      }
      if (res) {
        Alert.success('Successfully added ' + userToAdd.label + ' to your friendlist')
      }
    })
  }
  render () {
    return <Modal className='add-friend-modal' show={this.state.showModal} onHide={() => this.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Add a friend</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SimpleSelect
          ref='userSelection'
          options={this.state.options}
          placeholder='Select a user'
          theme='material'
          onSearchChange={(search) => {
            Meteor.call('getMentions', {mentionSearch: search}, (err, res) => {
              if (err) {
                //
              }
              if (res) {
                // create new tagOptions
                let userOptions = res.map(function (user) {
                  return {
                    label: user.profile.name,
                    value: user._id
                  }
                })
                this.setState({
                  options: userOptions
                })
              }
            })
          }}
        />
        <Button onClick={() => this.addToFriendList()}>Send friend request</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.close()}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}

export default AddFriendModal
