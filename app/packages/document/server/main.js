import { Meteor } from 'meteor/meteor'
import { Documents, DocumentComments, DocumentAccess } from '../lib/collections'
import { Tags } from '../../tags/lib/collections'
import { Counts } from 'meteor/tmeasday:publish-counts'

Meteor.publish('documentList', function () {
  const documents = Documents.find({'createdBy': this.userId}).fetch()
  let userList = []
  documents.forEach(function (document) {
    userList.push(document.createdBy)
  })
  return [
    Meteor.users.find({'_id': {$in: userList}}),
    Documents.find({'createdBy': this.userId})
  ]
})

Meteor.publish('document', function (args) {
  return Documents.find({'_id': args.id})
})

Meteor.publish('documentTags', function (args) {
  return Tags.find({ parentId: args.documentId, type: 'document' })
})

Meteor.publish('documentComments', function (args) {
  return DocumentComments.find({documentId: args.documentId, parents: {$type: 10}})
})

Meteor.publish('documentCommentsCount', function (args) {
  Counts.publish(this, 'documentCommentsCount', DocumentComments.find({documentId: args.documentId}))
})

Meteor.publish('documentAccess', function (args) {
  return DocumentAccess.find({documentId: args.documentId})
})

Meteor.publish('commentReplies', function (args) {
  return DocumentComments.find({documentId: args.documentId, parents: {$all: [args.parent]}})
})

Meteor.publish('commentRepliesCount', function (args) {
  Counts.publish(this, 'crc-' + args.parent.join(','), DocumentComments.find({documentId: args.documentId, parents: {$all: [args.parent]}}))
})
