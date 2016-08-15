import { Meteor } from 'meteor/meteor'
import { Tags } from '../../tags/lib/collections'
import { check } from 'meteor/check'
import { USERS_DEFAULT } from './userProjections'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

Meteor.publish('userTags', function (args) {
  check(args, {
    userId: String
  })
  if (this.userId) {
    return Tags.find({ parentId: args.userId, type: 'user' })
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('userprofile', function (args) {
  check(args, {
    userId: String
  })
  if (this.userId) {
    return Meteor.users.find({'_id': args.userId}, USERS_DEFAULT)
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('userprofiles', function (args) {
  check(args, {
    userIds: [String]
  })
  if (this.userId) {
    return Meteor.users.find({'_id': {$in: args.userIds}}, USERS_DEFAULT)
  } else {
    throw new Meteor.Error(401)
  }
})

DDPRateLimiter.addRule({
  name: 'userTags',
  type: 'subscription',
  connectionId () { return true }
}, 7, 1000)

DDPRateLimiter.addRule({
  name: 'userprofile',
  type: 'subscription',
  connectionId () { return true }
}, 7, 1000)

DDPRateLimiter.addRule({
  name: 'userprofiles',
  type: 'subscription',
  connectionId () { return true }
}, 7, 1000)
