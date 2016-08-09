import { Meteor } from 'meteor/meteor'
import { RequestAccessItems } from '../../lib/sharing/collections'
import { check, Match } from 'meteor/check'

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
