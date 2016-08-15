import { Meteor } from 'meteor/meteor'
import { ServerArgs } from '../lib/collections'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

Meteor.publish('serverArgs', function (args) {
  if (this.userId) {
    return ServerArgs.find({})
  } else {
    return []
  }
})

DDPRateLimiter.addRule({
  name: 'serverArgs',
  type: 'subscription',
  connectionId () { return true }
}, 7, 1000)
