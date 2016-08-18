import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import { composeWithTracker } from 'react-komposer'

function onPropsChange (props, onData) {
  let friend = props.friend
  if (!friend) {
    friend = Meteor.users.findOne({_id: props.friendId})
  }
  onData(null, {friend, friendId: props.friendId})
}

class FriendChatHeader extends Component {
  render () {
    const { friendId, friend } = this.props
    return <div style={{
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
  }
}

FriendChatHeader.propTypes = {
  friend: React.PropTypes.object,
  friendId: React.PropTypes.string
}

export default composeWithTracker(onPropsChange)(FriendChatHeader)
