import React, {Component} from 'react'
import EventEmitterInstance from '../../../../../common/client/EventEmitter'
import NewChatMsgInput from './NewChatMsgInput'
import ChatMsgList from './ChatMsgList'

class FriendChat extends Component {
  close () {
    EventEmitterInstance.emit('close-friend-small-chat')
  }
  render () {
    const { friend, friendId } = this.props
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
        {friend && friend.profile ? friend.profile.name : friendId}
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
        <ChatMsgList friendId={this.props.friendId} />
        <NewChatMsgInput friendId={this.props.friendId} />
      </div>
    </div>
  }
}

FriendChat.propTypes = {
  friendId: React.PropTypes.string,
  friend: React.PropTypes.object,
  directMessages: React.PropTypes.array
}

export default FriendChat
