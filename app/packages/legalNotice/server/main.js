import { Meteor } from 'meteor/meteor'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

Meteor.publish('legalNotice', function () {
  return []
})

DDPRateLimiter.addRule({
  name: 'legalNotice',
  type: 'subscription',
  connectionId () { return true }
}, 2, 1000)
