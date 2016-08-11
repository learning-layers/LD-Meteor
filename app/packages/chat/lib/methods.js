import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { FriendRequests } from './collections'

Meteor.methods({
  sendFriendRequest: function (userId) {
    check(userId, String)
    if (this.userId) {
      return FriendRequests.insert({ requester: this.userId, user: userId, status: 'pending' })
    } else {
      throw new Meteor.Error(401)
    }
  }
})
