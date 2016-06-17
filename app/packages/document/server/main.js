import { Meteor } from 'meteor/meteor'
import { Documents } from '../lib/collections'
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
