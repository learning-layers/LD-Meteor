import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { GroupChatTopicSchema, GroupChatMessageSchema } from './schema'

export const GroupChatTopics = new Mongo.Collection('GroupChatTopics')
if (Meteor.isServer) {
  GroupChatTopics._ensureIndex({_id: 1, groupId: 1, 'wantToBeNotified.userId': 1})
  GroupChatTopics._ensureIndex({'wantToBeNotified.userId': 1})
}
GroupChatTopics.attachSchema(GroupChatTopicSchema)

export const GroupChatMessages = new Mongo.Collection('GroupChatMessages')
if (Meteor.isServer) {
  GroupChatMessages._ensureIndex({channelId: 1, createdAt: 1})
}
GroupChatMessages.attachSchema(GroupChatMessageSchema)
