import { Meteor } from 'meteor/meteor'
import { DocumentInfoCaches } from '../../lib/attachments/collections'
import { Uploads } from '../../../fileUpload/lib/collections'
import { check } from 'meteor/check'

Meteor.publish('documentInfoCache', function (args) {
  check(args, {
    documentId: String
  })
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

Meteor.publish('documentAttachments', function (args) {
  check(args, {
    documentId: String
  })
  return Uploads.collection.find({'meta.parent.collection': 'document', 'meta.parent.uploadType': 'attachment', 'meta.parent.elementId': args.documentId})
})
