import { Meteor } from 'meteor/meteor'
import { Documents } from '../lib/collections'

Meteor.publish('documentList', function () {
  return Documents.find({'createdBy': this.userId})
})

Meteor.publish('document', function (args) {
  return Documents.find({'_id': args.id})
})
