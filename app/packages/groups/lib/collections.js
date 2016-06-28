import { Mongo } from 'meteor/mongo'
import { GroupSchema } from './schema'
import { Meteor } from 'meteor/meteor'

export const Groups = new Mongo.Collection('Groups')
if (Meteor.isServer) {
  Groups._ensureIndex({ 'members.userId': 1 })
}
Groups.attachSchema(GroupSchema)
