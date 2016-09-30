import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { UserPositionSchema, UserActivityHistorySchema } from './schema'

export const UserPositions = new Mongo.Collection('UserPositions')
UserPositions.attachSchema(UserPositionSchema)
if (Meteor.isServer) {
  UserPositions._ensureIndex({ userId: 1 })
  UserPositions._ensureIndex({ type: 1, elementId: 1 })
}

export const UserActivityHistory = new Mongo.Collection('UserActivityHistory')
UserActivityHistory.attachSchema(UserActivityHistorySchema)
if (Meteor.isServer) {
  UserActivityHistory._ensureIndex({userId: 1, type: 1})
}
