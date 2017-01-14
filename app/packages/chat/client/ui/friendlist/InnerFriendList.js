import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import EventEmitterInstance from '../../../../../common/client/EventEmitter'

class FriendListGroup extends Component {
  render () {
    const { groupId, name } = this.props
    return <li>
      {groupId} - {name}
    </li>
  }
}

FriendListGroup.propTypes = {
  groupId: React.PropTypes.string,
  name: React.PropTypes.string
}

class Friend extends Component {
  openSmallChatWindow (friendId) {
    EventEmitterInstance.emit('open-friend-small-chat', friendId)
  }
  render () {
    const { friend } = this.props
    return <li>
      <span>{friend.profile.name}</span>
      <button className='btn btn-default' onClick={() => this.openSmallChatWindow(friend._id)}>
        <span className='glyphicon glyphicon-comment' />
      </button>
    </li>
  }
}

Friend.propTypes = {
  friend: React.PropTypes.object
}

class InnerFriendList extends Component {
  render () {
    const { friendList } = this.props /* activeFilter, */
    // console.log(activeFilter)
    return <div id='inner-friendlist'>
      {friendList ? <span>
        <ul>
          {friendList.friendIds.map(function (friendId) {
            let friend = Meteor.users.findOne({_id: friendId})
            if (friend) {
              return <Friend key={'friend-' + friend._id} friend={friend} />
            } else {
              return null
            }
          })}
          {friendList.groups.map(function (group) {
            return <FriendListGroup groupId={group._id} name={group.name} />
          })}
        </ul>
      </span> : null}
    </div>
  }
}

InnerFriendList.propTypes = {
  activeFilter: React.PropTypes.string,
  friendList: React.PropTypes.object
}

export default InnerFriendList
