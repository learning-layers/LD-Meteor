import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Tests } from '../lib/collections'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

Meteor.publish('testData', function () {
  if (this.userId && Roles.userIsInRole(this.userId, ['admin'])) {
    return Tests.find()
  } else {
    throw new Meteor.Error(401)
  }
})

DDPRateLimiter.addRule({
  name: 'testData',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)
