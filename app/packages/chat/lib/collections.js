import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { FriendRequestSchema, FriendListSchema, DirectMessageSchema } from './schema'

export const FriendRequests = new Mongo.Collection('FriendRequests')
FriendRequests.attachSchema(FriendRequestSchema)
if (Meteor.isServer) {
  FriendRequests._ensureIndex({ user: 1, status: 1 })
}

export const FriendLists = new Mongo.Collection('FriendLists')
FriendLists.attachSchema(FriendListSchema)
if (Meteor.isServer) {
  FriendLists._ensureIndex({ userId: 1 })
}

export const DirectMessages = new Mongo.Collection('DirectMessages')
DirectMessages.attachSchema(DirectMessageSchema)
if (Meteor.isServer) {
  DirectMessages._ensureIndex({ from: 1, to: 1, createdAt: 1 })
  // TODO DirectMessages._ensureIndex({ title: 'text' }, {'weights': { title: 10 }, name: 'DocumentTextIndex'})
}
