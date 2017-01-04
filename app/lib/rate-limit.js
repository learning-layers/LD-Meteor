import { Meteor } from 'meteor/meteor'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'

const assignLimits = ({ methods, limit, timeRange }) => {
  if (Meteor.isServer) {
    DDPRateLimiter.addRule({
      name (name) { return _.contains(methods, name) },
      connectionId () { return true }
    }, limit, timeRange)
  }
}

export const rateLimit = (options) => assignLimits(options)
