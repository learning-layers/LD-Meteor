import { Meteor } from 'meteor/meteor'
import { Documents, DocumentComments } from '../lib/collections'
import { Tags } from '../../tags/lib/collections'

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
  return DocumentComments.find({documentId: args.documentId, parent: {'$type': 10}})
})
