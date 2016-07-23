import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const ServerArgs = new Mongo.Collection('serverArgs')
if (Meteor.isServer) {
  ServerArgs._ensureIndex({ itemId: 1 })
}
