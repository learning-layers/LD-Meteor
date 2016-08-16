import { Meteor } from 'meteor/meteor'
import { FriendRequests, FriendLists } from '../lib/collections'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { USERS_DEFAULT } from '../../user/server/userProjections'

Meteor.publish('friendList', function () {
  if (this.userId) {
    this.autorun(function () {
      let friendList = FriendLists.findOne({ userId: this.userId })
      let friendIds = []
      if (friendList.friendIds) {
        friendIds = friendList.friendIds
      }
      return [
        FriendRequests.find({ user: this.userId, status: 'pending' }),
        FriendLists.find({ userId: this.userId }),
        Meteor.users.find({'_id': {$in: friendIds}}, USERS_DEFAULT)
      ]
    })
  } else {
    return Meteor.Error(401)
  }
})

DDPRateLimiter.addRule({
  name: 'friendList',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)
