import { Mongo } from 'meteor/mongo'
import { DocumentSchema, DocumentCommentSchema } from './schema'

export const Documents = new Mongo.Collection('Documents')
Documents.attachSchema(DocumentSchema)

export const DocumentComments = new Mongo.Collection('DocumentComments')
DocumentComments.attachSchema(DocumentCommentSchema)
