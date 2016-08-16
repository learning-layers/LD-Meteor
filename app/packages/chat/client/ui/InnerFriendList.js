import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'

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

class InnerFriendList extends Component {
  render () {
    const { activeFilter, friendList } = this.props
    console.log(activeFilter)
    return <div id='inner-friendlist'>
      {friendList ? <span>
        <ul>
          {friendList.friendIds.map(function (friendId) {
            let friend = Meteor.users.findOne({_id: friendId})
            return <li>{friend ? friend.profile.name : friendId}</li>
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
