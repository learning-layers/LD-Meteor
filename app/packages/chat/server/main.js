import { Meteor } from 'meteor/meteor'
import { FriendRequests } from '../lib/collections'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

Meteor.publish('friendList', function () {
  if (this.userId) {
    return FriendRequests.find({user: this.userId, status: 'pending'})
  } else {
    return Meteor.Error(401)
  }
})

DDPRateLimiter.addRule({
  name: 'friendList',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)
