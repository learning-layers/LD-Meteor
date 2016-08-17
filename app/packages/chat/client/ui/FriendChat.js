import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import { composeWithTracker } from 'react-komposer'
import EventEmitterInstance from '../../../../common/client/EventEmitter'
import { DirectMessages } from '../../lib/collections'

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
  close () {
    EventEmitterInstance.emit('close-friend-small-chat')
  }
  sendMessage () {
    Meteor.call('sendDirectMessage', this.props.friendId, 'Hello World')
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
        <ul style={{margin: 0}}>
          {directMessages.map(function (directMessage) {
            return <li>{directMessage.message}</li>
          })}
        </ul>
        <button className='btn btn-success' onClick={() => this.sendMessage()}>Send</button>
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
