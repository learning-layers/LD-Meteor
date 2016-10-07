import { Meteor } from 'meteor/meteor'
import { RequestAccessItems } from '../../lib/sharing/collections'
import { Documents } from '../../lib/collections'
import { check, Match } from 'meteor/check'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { USERS_DEFAULT } from '../../../user/server/userProjections'
import { DOCUMENTS_PREVIEW } from '../../server/documentProjections'

Meteor.publish('requestAccessToDocumentItems', function (args) {
  check(args, {
    token: Match.Maybe(String),
    documentId: Match.Maybe(String)
  })
  if (this.userId) {
    if (args.token) {
      let userIds = []
      let documentIds = []
      const requestAccessItem = RequestAccessItems.findOne({ token: args.token, owner: this.userId })
      if (requestAccessItem) {
        userIds.push(requestAccessItem.createdBy)
        documentIds.push(requestAccessItem.documentId)
      }
      return [
        RequestAccessItems.find({ token: args.token, owner: this.userId }),
        Meteor.users.find({_id: {$in: userIds}}, USERS_DEFAULT),
        Documents.find({_id: {$in: documentIds}}, DOCUMENTS_PREVIEW)
      ]
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
