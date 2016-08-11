import { Meteor } from 'meteor/meteor'
import { FriendRequests } from '../lib/collections'

Meteor.publish('friendList', function () {
  if (this.userId) {
    return FriendRequests.find({user: this.userId, status: 'pending'})
  } else {
    return Meteor.Error(401)
  }
})
