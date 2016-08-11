import { Mongo } from 'meteor/mongo'
import { FriendRequestSchema } from './schema'

export const FriendRequests = new Mongo.Collection('FriendRequests')
FriendRequests.attachSchema(FriendRequestSchema)
