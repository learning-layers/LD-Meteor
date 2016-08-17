import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { composeWithTracker } from 'react-komposer'
import EventEmitterInstance from '../../../../common/client/EventEmitter'
import { DirectMessages } from '../../lib/collections'
import ChatLineCalculator from '../lib/chatLineCalculator'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import FormControl from '../../../../../node_modules/react-bootstrap/lib/FormControl'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('friendChat', {friendId: props.friendId})
  if (handle.ready()) {
    let friend = Meteor.users.findOne({_id: props.friendId})
    let directMessages = DirectMessages.find({ $or: [
      {from: props.friendId, to: Meteor.userId()},
      {from: Meteor.userId(), to: props.friendId}
    ]})
    onData(null, {friend, directMessages})
  }
}

class FriendChat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newMessage: ''
    }
  }
  close () {
    EventEmitterInstance.emit('close-friend-small-chat')
  }
  sendMessage () {
    const message = 'OpieOP haha Kappa lel Lorem ipsum dolor OpieOP amet, consetetur \r\nsadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
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
    console.log(emotePositions)
    Meteor.call('sendDirectMessage', this.props.friendId, this.state.newMessage, emotePositions)
  }
  handleMsgChange (event) {
    let newMessage = ReactDOM.findDOMNode(event.target).value
    this.setState({
      newMessage: newMessage
    })
  }
  render () {
    const { friendId, friend, directMessages } = this.props
    console.log(friendId)
    return <div id='small-friend-chat' style={{position: 'relative'}}>
      <div style={{
        display: 'block',
        textAlign: 'center',
        padding: '7px 5px',
        backgroundColor: 'lightgrey',
        height: '35px',
        fontWeight: 'bold'
      }}>
        <span className='glyphicon glyphicon-comment' style={{marginRight: '5px'}} />
        {friend.profile.name}
      </div>
      <div style={{
        position: 'absolute',
        top: 0,
        marginTop: '-3px',
        right: '5px',
        fontWeight: 'bold',
        fontSize: '30px',
        cursor: 'pointer'
      }} onClick={() => this.close()}>
        &times;
      </div>
      <div className='chat-body' style={{
        height: 'calc(100vh - 197px)',
        backgroundColor: '#FEF9E7'
      }}>
        <ul style={{margin: 0, paddingLeft: 0, fontFamily: '\'Droid Sans Mono\', sans-serif', fontSize: '12px'}}>
          {directMessages.map(function (directMessage) {
            let emotes = directMessage.emotes
            if (!emotes) {
              emotes = []
            }
            let formattedEmotes = {}
            emotes.forEach(function (emoteObj) {
              formattedEmotes[emoteObj.key] = emoteObj.range
            })
            let messageWithEmotesObject = new ChatLineCalculator().formatEmotes(directMessage.message, formattedEmotes)
            return <li style={{listStyle: 'none'}}>
              {messageWithEmotesObject.lines.map(function (line, i) {
                let lineHeight = 17
                if (line.containsEmoticons) {
                  lineHeight = 26
                }
                return <div style={{display: 'block', height: lineHeight + 'px', overflow: 'visible'}} key={'line-' + i}>{line.lineContents.map(function (lineContent, j) {
                  return <div style={{display: 'inline'}} key={'line-' + i + '-content-' + j}>{lineContent}</div>
                })}</div>
              })}
            </li>
          })}
        </ul>
        <div className='' style={{backgroundColor: 'white', position: 'absolute', bottom: 0}}>
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
      </div>
    </div>
  }
}

FriendChat.propTypes = {
  friendId: React.PropTypes.string,
  friend: React.PropTypes.object,
  directMessages: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(FriendChat)
