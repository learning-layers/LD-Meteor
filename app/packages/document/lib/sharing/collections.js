import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const RequestAccessItems = new Mongo.Collection('RequestAccessItems')
if (Meteor.isServer) {
  RequestAccessItems._ensureIndex({token: 1, owner: 1})
  RequestAccessItems._ensureIndex({documentId: 1, createdBy: 1})
}
