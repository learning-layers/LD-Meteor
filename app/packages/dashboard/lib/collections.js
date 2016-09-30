import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { UserPositionSchema } from './schema'

export const UserPositions = new Mongo.Collection('UserPositions')
UserPositions.attachSchema(UserPositionSchema)
if (Meteor.isServer) {
  UserPositions._ensureIndex({ userId: 1 })
  UserPositions._ensureIndex({ type: 1, elementId: 1 })
}
