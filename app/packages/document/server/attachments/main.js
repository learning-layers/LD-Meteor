import { Meteor } from 'meteor/meteor'
import { DocumentInfoCaches } from '../../lib/attachments/collections'

Meteor.publish('documentInfoCache', function (args) {
  if (this.userId) {
    if (args.documentId) {
      let documentInfoCache = DocumentInfoCaches.findOne({documentId: args.documentId})
      if (!documentInfoCache) {
        DocumentInfoCaches.insert({
          documentId: args.documentId,
          fileAttachmentCounter: 0
        })
      }
      return DocumentInfoCaches.find({documentId: args.documentId})
    }
  } else {
    throw new Meteor.Error(403)
  }
})
