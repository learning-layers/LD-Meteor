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
  componentDidMount () {
    Meteor.setInterval(() => {
      console.log(this.state.cursorPosition)
    }, 10000)
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
    this.state.cursorPosition = event.target.selectionEnd
    let newMessage = ReactDOM.findDOMNode(event.target).value
    this.setState({
      newMessage: newMessage
    })
  }
  showEmoticons () {
    let newMessage = this.state.newMessage
    let cursorPosition = this.state.cursorPosition
    if (!cursorPosition) {
      newMessage += 'Kappa '
    } else {
      newMessage = [newMessage.slice(0, cursorPosition), 'Kappa ', newMessage.slice(cursorPosition)].join('')
    }
    this.setState({
      newMessage: newMessage
    })
  }
  trackCursorPosition (event) {
    this.state.cursorPosition = event.target.selectionEnd
  }
  render () {
    /*
    <img
      className='emoticon'
      src='http://static-cdn.jtvnw.net/emoticons/v1/25/3.0'
      style={{
        position: 'absolute',
        top: '5px',
        right: '10px',
        width: '23px',
        cursor: 'pointer'
      }}
      onClick={() => this.showEmoticons()}
    />
    */
    return <div className='new-chat-msg-input' style={{
      backgroundColor: 'white',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      borderTop: '1px solid lightgrey'
    }}>
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
          onClick={(event) => this.trackCursorPosition(event)}
          onFocus={(event) => this.trackCursorPosition(event)}
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
        <div className='clearfix'></div>
      </FormGroup>
    </div>
  }
}

NewChatMsgInput.propTypes = {
  friendId: React.PropTypes.string
}

export default NewChatMsgInput
