import { Mongo } from 'meteor/mongo'
import { DocumentSchema, DocumentCommentSchema, DocumentAccessSchema } from './schema'
import { Meteor } from 'meteor/meteor'

export const Documents = new Mongo.Collection('Documents')
Documents.attachSchema(DocumentSchema)
if (Meteor.isServer) {
  Documents._ensureIndex({ createdBy: 1 })
}
global['Documents'] = Documents

export const DocumentComments = new Mongo.Collection('DocumentComments')
DocumentComments.attachSchema(DocumentCommentSchema)
if (Meteor.isServer) {
  DocumentComments._ensureIndex({ documentId: 1, parents: 1 })
}

export const DocumentAccess = new Mongo.Collection('DocumentAccess')
DocumentAccess.attachSchema(DocumentAccessSchema)
if (Meteor.isServer) {
  DocumentAccess._ensureIndex({ documentId: 1, 'userCanView.userId': 1 })
  DocumentAccess._ensureIndex({ documentId: 1, 'userCanComment.userId': 1 })
  DocumentAccess._ensureIndex({ documentId: 1, 'userCanEdit.userId': 1 })
  DocumentAccess._ensureIndex({ documentId: 1, 'groupCanView.groupId': 1 })
  DocumentAccess._ensureIndex({ documentId: 1, 'groupCanComment.groupId': 1 })
  DocumentAccess._ensureIndex({ documentId: 1, 'groupCanEdit.groupId': 1 })

  DocumentAccess._ensureIndex({ 'userCanView.userId': 1 })
  DocumentAccess._ensureIndex({ 'userCanComment.userId': 1 })
  DocumentAccess._ensureIndex({ 'userCanEdit.userId': 1 })
  DocumentAccess._ensureIndex({ 'groupCanView.groupId': 1 })
  DocumentAccess._ensureIndex({ 'groupCanComment.groupId': 1 })
  DocumentAccess._ensureIndex({ 'groupCanEdit.groupId': 1 })
}
