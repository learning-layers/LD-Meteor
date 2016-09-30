import { Mongo } from 'meteor/mongo'
import { UserPositionSchema } from './schema'

export const UserPositions = new Mongo.Collection('UserPositions')
UserPositions.attachSchema(UserPositionSchema)
