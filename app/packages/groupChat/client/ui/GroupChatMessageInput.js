import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import FormControl from '../../../../../node_modules/react-bootstrap/lib/FormControl'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'

class GroupChatMessageInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newMessage: ''
    }
  }
  handleMsgChange (event) {
    let newMessage = ReactDOM.findDOMNode(event.target).value
    this.setState({
      newMessage: newMessage
    })
  }
  sendMessage () {
    const { groupId, topicId } = this.props
    const message = this.state.newMessage
    Meteor.call('sendGroupMessage', groupId, topicId, message)
    this.setState({
      newMessage: ''
    })
  }
  render () {
    const { groupId, groupName, topicId, topicName } = this.props
    return <div id='group-chat-message-input'>
      <span style={{display: 'none'}}>
        {topicId ? <span>{groupId} - {groupName} - {topicId} - {topicName}</span> : null}
      </span>
      <FormGroup controlId='formControlsTextarea' style={{
        padding: '5px',
        marginBottom: '10px'
      }}>
        <FormControl
          componentClass='textarea'
          placeholder='Your message...'
          onChange={(event) => this.handleMsgChange(event)}
          value={this.state.newMessage}
          style={{
            fontFamily: '\'Droid Sans Mono\', sans-serif',
            fontSize: '12px',
            height: '67px',
            resize: 'none',
            paddingRight: '25px'
          }}
        />
        <Button
          bsStyle='success'
          onClick={() => this.sendMessage()}
          style={{
            marginTop: '5px',
            display: 'inline-block',
            float: 'right'
          }}>
          Send
        </Button>
        <div className='clearfix' />
      </FormGroup>
    </div>
  }
}

export default GroupChatMessageInput
