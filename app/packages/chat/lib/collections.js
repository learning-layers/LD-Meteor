import { Mongo } from 'meteor/mongo'
import { FriendRequestSchema, FriendListSchema } from './schema'

export const FriendRequests = new Mongo.Collection('FriendRequests')
FriendRequests.attachSchema(FriendRequestSchema)

export const FriendLists = new Mongo.Collection('FriendLists')
FriendLists.attachSchema(FriendListSchema)
