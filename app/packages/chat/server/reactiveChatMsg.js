import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { DirectMessages } from '../lib/collections'
import { USERS_DEFAULT } from '../../user/server/userProjections'
import { ServerArgs } from '../../serverargs/lib/collections'

let getChatMsgPublishers = function (args) {
  const argsLimit = args.limit
  const friendId = args.friendId
  let currentUserId
  if (args.currentUserId) {
    currentUserId = args.currentUserId
  } else {
    currentUserId = this.userId
  }
  return [
    Meteor.users.find({'_id': friendId}, USERS_DEFAULT),
    DirectMessages.find({ $or: [
      {from: friendId, to: currentUserId},
      {from: currentUserId, to: friendId}
    ]}, {sort: {createdAt: -1}, limit: argsLimit})
  ]
}

Meteor.publish('reactiveChatMsgList', function (initialArgs) {
  check(initialArgs, {
    friendId: String,
    limit: Number
  })
  const itemId = 'reactiveChatMsgList'
  if (this.userId) {
    ServerArgs.upsert({itemId: itemId, createdBy: this.userId}, {itemId: itemId, createdBy: this.userId, args: initialArgs})
    this.autorun(function () {
      const serverArgs = ServerArgs.findOne({itemId: itemId, createdBy: this.userId})
      // console.log('serverArgs=', serverArgs)
      if (serverArgs) {
        // use server args
        return getChatMsgPublishers.call(this, {
          friendId: serverArgs.args.friendId,
          limit: serverArgs.args.limit,
          currentUserId: serverArgs.createdBy
        })
      } else {
        // use initial args, server args not yet accessible
        return getChatMsgPublishers.call(this, {
          friendId: initialArgs.friendId,
          limit: initialArgs.limit
        })
      }
    })
  } else {
    return Meteor.Error(401)
  }
})

DDPRateLimiter.addRule({
  name: 'reactiveChatMsgList',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)
