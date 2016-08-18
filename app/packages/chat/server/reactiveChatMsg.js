import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { DirectMessages } from '../lib/collections'
import { USERS_DEFAULT } from '../../user/server/userProjections'
import { ServerArgs } from '../../serverargs/lib/collections'

let getChatMsgPublishers = function (args) {
  return [
    Meteor.users.find({'_id': args.friendId}, USERS_DEFAULT),
    DirectMessages.find({ $or: [
      {from: args.friendId, to: this.userId},
      {from: this.userId, to: args.friendId}
    ]}, {sort: {createdAt: -1}, limit: args.limit})
  ]
}

Meteor.publish('reactiveChatMsgList', function (initialArgs) {
  check(initialArgs, {
    friendId: String,
    limit: Number
  })
  const itemId = 'reactiveChatMsgList'
  if (this.userId) {
    ServerArgs.upsert({'itemId': itemId, createdBy: this.userId}, {'itemId': itemId, createdBy: this.userId, args: initialArgs})
    this.autorun(function () {
      const serverArgs = ServerArgs.findOne({'itemId': itemId, createdBy: this.userId})
      if (serverArgs) {
        if (!serverArgs.args.language) {
          serverArgs.args.language = 'en'
        }
        // use server args
        return getChatMsgPublishers.call(this, {
          friendId: serverArgs.args.friendId,
          limit: initialArgs.limit
        })
      } else {
        if (!initialArgs.language) {
          initialArgs.language = 'en'
        }
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
