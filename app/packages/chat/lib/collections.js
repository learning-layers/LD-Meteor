import { Mongo } from 'meteor/mongo'
import { FriendRequestSchema, FriendListSchema, DirectMessageSchema } from './schema'

export const FriendRequests = new Mongo.Collection('FriendRequests')
FriendRequests.attachSchema(FriendRequestSchema)

export const FriendLists = new Mongo.Collection('FriendLists')
FriendLists.attachSchema(FriendListSchema)

export const DirectMessages = new Mongo.Collection('DirectMessages')
DirectMessages.attachSchema(DirectMessageSchema)
