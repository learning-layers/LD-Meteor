import { Meteor } from 'meteor/meteor'
import { RequestAccessItems } from '../../lib/sharing/collections'

Meteor.publish('requestAccessToDocumentItems', function (args) {
  if (args.token) {
    return RequestAccessItems.find({ token: args.token, $or: [ { owner: this.userId }, { createdBy: this.userId } ] })
  } else if (args.documentId) {
    return RequestAccessItems.find({ documentId: args.documentId, $or: [ { owner: this.userId }, { createdBy: this.userId } ] })
  }
})
