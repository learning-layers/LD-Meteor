import { Meteor } from 'meteor/meteor'
import { Documents } from './collections'
import { DocumentSchema } from './schema'
import { check } from 'meteor/check'

Meteor.methods({
  createDocument: function (document) {
    document.createdAt = new Date()
    document.createdBy = this.userId
    check(document, DocumentSchema)
    return Documents.insert(document)
  }
})
