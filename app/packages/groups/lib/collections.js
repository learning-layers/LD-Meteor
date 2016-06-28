import { Mongo } from 'meteor/mongo'
import { GroupSchema } from './schema'

export const Groups = new Mongo.Collection('Groups')
Groups.attachSchema(GroupSchema)
