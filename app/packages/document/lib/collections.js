import { Mongo } from 'meteor/mongo'
import { DocumentSchema, DocumentCommentSchema } from './schema'
import { Meteor } from 'meteor/meteor'

export const Documents = new Mongo.Collection('Documents')
Documents.attachSchema(DocumentSchema)

export const DocumentComments = new Mongo.Collection('DocumentComments')
DocumentComments.attachSchema(DocumentCommentSchema)
if (Meteor.isServer) {
  DocumentComments._ensureIndex({ documentId: 1, parents: 1 })
}
