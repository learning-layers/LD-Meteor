import { Meteor } from 'meteor/meteor'
import { DocumentInfoCaches } from '../../lib/attachments/collections'
import { Uploads } from '../../../fileUpload/lib/collections'
import { check } from 'meteor/check'
import { UPLOADS_DEFAULT } from '../../../fileUpload/server/uploadProjections'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

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
    } else {
      throw new Meteor.Error(400, 'No documentId provided')
    }
  } else {
    throw new Meteor.Error(403)
  }
})

Meteor.publish('documentAttachments', function (args) {
  check(args, {
    documentId: String
  })
  // TODO check for viewSharingId
  // TODO check if the user has access to the document
  return Uploads.collection.find({
    'meta.parent.collection': 'document',
    'meta.parent.uploadType': 'attachment',
    'meta.parent.elementId': args.documentId
  }, UPLOADS_DEFAULT)
})

DDPRateLimiter.addRule({
  name: 'documentInfoCache',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)

DDPRateLimiter.addRule({
  name: 'documentAttachments',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)
