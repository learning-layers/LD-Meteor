import { Mongo } from 'meteor/mongo'
import { DocumentSchema } from './schema'

export const Documents = new Mongo.Collection('Documents')
Documents.attachSchema(DocumentSchema)

export const DocumentComments = new Mongo.Collection('DocumentComments')
