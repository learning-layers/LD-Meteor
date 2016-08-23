import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { FriendRequests, FriendLists, DirectMessages } from '../lib/collections'
import { USERS_DEFAULT } from '../../user/server/userProjections'

Meteor.publish('friendList', function () {
  if (this.userId) {
    this.autorun(function () {
      let friendList = FriendLists.findOne({ userId: this.userId })
      let friendIds = []
      if (friendList && friendList.friendIds) {
        friendIds = friendList.friendIds
      }
      let friendRequests = FriendRequests.find({ user: this.userId, status: 'pending' }).fetch()
      let requesters = []
      friendRequests.forEach(function (friendRequest) {
        requesters.push(friendRequest.requester)
      })
      let userIdsToBeLoaded = friendIds.concat(requesters)
      return [
        Meteor.users.find({'_id': {$in: userIdsToBeLoaded}}, USERS_DEFAULT),
        FriendRequests.find({ user: this.userId, status: 'pending' }),
        FriendLists.find({ userId: this.userId })
      ]
    })
  } else {
    return Meteor.Error(401)
  }
})

Meteor.publish('friendChat', function (args) {
  check(args, {friendId: String})
  if (this.userId) {
    return [
      Meteor.users.find({'_id': args.friendId}, USERS_DEFAULT),
      DirectMessages.find({ $or: [
        {from: args.friendId, to: this.userId},
        {from: this.userId, to: args.friendId}
      ]})
    ]
  } else {
    return Meteor.Error(401)
  }
})

DDPRateLimiter.addRule({
  name: 'friendList',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)

DDPRateLimiter.addRule({
  name: 'friendChat',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)
