import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const DocumentInfoCaches = new Mongo.Collection('DocumentInfoCaches')
if (Meteor.isServer) {
  DocumentInfoCaches._ensureIndex({documentId: 1}, {'unique': true})
}
