import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Roles } from 'meteor/alanning:roles'
import { USERS_DEFAULT } from '../../user/server/userProjections'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

Meteor.publish('userList', function () {
  if (this.userId && Roles.userIsInRole(this.userId, ['super-admin'])) {
    let defaultProjections = USERS_DEFAULT
    defaultProjections.fields.status = 1
    defaultProjections.fields.tos = 1
    defaultProjections.fields.emails = 1
    return Meteor.users.find({}, defaultProjections)
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('user', function (args) {
  check(args, {
    userId: String
  })
  if (this.userId) {
    return Meteor.users.find({'_id': args.userId}, USERS_DEFAULT)
  } else {
    throw new Meteor.Error(401)
  }
})

DDPRateLimiter.addRule({
  name: 'userList',
  type: 'subscription',
  connectionId () { return true }
}, 2, 1000)

DDPRateLimiter.addRule({
  name: 'user',
  type: 'subscription',
  connectionId () { return true }
}, 2, 1000)
