import { Meteor } from 'meteor/meteor'
import { RequestAccessItems } from '../../lib/sharing/collections'
import { check, Match } from 'meteor/check'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

Meteor.publish('requestAccessToDocumentItems', function (args) {
  check(args, {
    token: Match.Maybe(String),
    documentId: Match.Maybe(String)
  })
  if (this.userId) {
    if (args.token) {
      return RequestAccessItems.find({ token: args.token, owner: this.userId })
    } else if (args.documentId) {
      return RequestAccessItems.find({ documentId: args.documentId, createdBy: this.userId })
    }
  } else {
    throw new Meteor.Error(401)
  }
})

DDPRateLimiter.addRule({
  name: 'requestAccessToDocumentItems',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)
