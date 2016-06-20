import { Meteor } from 'meteor/meteor'
import { Documents, DocumentComments } from '../lib/collections'
import { Tags } from '../../tags/lib/collections'
import { Counts } from 'meteor/tmeasday:publish-counts'

Meteor.publish('documentList', function () {
  return Documents.find({'createdBy': this.userId})
})

Meteor.publish('document', function (args) {
  return Documents.find({'_id': args.id})
})

Meteor.publish('documentTags', function (args) {
  return Tags.find({ parentId: args.documentId, type: 'document' })
})

Meteor.publish('documentComments', function (args) {
  // {documentId: 'iSzHRYSngztqHeR3C', parent: { '$type' : 10}}
  return DocumentComments.find({documentId: args.documentId, parents: {$type: 10}})
})

Meteor.publish('documentCommentsCount', function (args) {
  Counts.publish(this, 'documentCommentsCount', DocumentComments.find({documentId: args.documentId}))
})

Meteor.publish('commentReplies', function (args) {
  return DocumentComments.find({documentId: args.documentId, parents: {$all: [args.parent]}})
})

Meteor.publish('commentRepliesCount', function (args) {
  Counts.publish(this, 'crc-' + args.parent, DocumentComments.find({documentId: args.documentId, parents: {$all: [args.parent]}}))
})
