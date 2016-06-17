import { Meteor } from 'meteor/meteor'
import { Documents } from './collections'
import { DocumentSchema } from './schema'
import { check } from 'meteor/check'
import { Tags } from '../../tags/lib/collections'

Meteor.methods({
  createDocument: function (document) {
    document.createdAt = new Date()
    document.createdBy = this.userId
    check(document, DocumentSchema)
    return Documents.insert(document)
  },
  addTagToDocument: function (tagLabel, tagValue, documentId) {
    if (this.userId) {
      // TODO check that the user has access and is allowed to add tags
      return Tags.insert({label: tagLabel, value: tagValue, parentId: documentId, type: 'document'})
    } else {
      throw new Meteor.Error(401)
    }
  },
  removeTagFromDocument: function (tagId) {
    if (this.userId) {
      return Tags.remove({'_id': tagId})
    } else {
      throw new Meteor.Error(401)
    }
  }
})
