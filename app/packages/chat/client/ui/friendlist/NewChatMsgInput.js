import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import FormGroup from '../../../../../../node_modules/react-bootstrap/lib/FormGroup'
import FormControl from '../../../../../../node_modules/react-bootstrap/lib/FormControl'
import Button from '../../../../../../node_modules/react-bootstrap/lib/Button'
import ChatLineCalculator from '../../lib/chatLineCalculator'

class NewChatMsgInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newMessage: ''
    }
  }
  sendMessage () {
    // const message = 'OpieOP haha Kappa lel Lorem ipsum dolor OpieOP amet, consetetur \r\nsadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
    const message = this.state.newMessage
    let emotePositions = new ChatLineCalculator().parseStringToEmotes(
      message,
      [
        {
          code: 356,
          sLength: 6,
          text: 'OpieOP'
        },
        {
          code: 25,
          sLength: 5,
          text: 'Kappa'
        }
      ]
    )
    Meteor.call('sendDirectMessage', this.props.friendId, message, emotePositions)
  }
  handleMsgChange (event) {
    let newMessage = ReactDOM.findDOMNode(event.target).value
    this.setState({
      newMessage: newMessage
    })
  }
  render () {
    return <div className='' style={{backgroundColor: 'white', position: 'absolute', bottom: 0}}>
      <FormGroup controlId='formControlsTextarea'>
        <FormControl
          componentClass='textarea'
          placeholder='textarea'
          onChange={(event) => this.handleMsgChange(event)}
          value={this.state.newMessage}
          style={{fontFamily: '\'Droid Sans Mono\', sans-serif', fontSize: '12px', width: '250px'}}
        />
      </FormGroup>
      <Button bsStyle='success' onClick={() => this.sendMessage()}>Send</Button>
    </div>
  }
}

NewChatMsgInput.propTypes = {
  friendId: React.PropTypes.string
}

export default NewChatMsgInput
