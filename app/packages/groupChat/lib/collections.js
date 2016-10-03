import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { GroupChatTopicSchema, GroupChatMessageSchema } from './schema'

export const GroupChatTopics = new Mongo.Collection('GroupChatTopics')
if (Meteor.isServer) {
  GroupChatTopics._ensureIndex({_id: 1, groupId: 1, 'wantToBeNotified.userId': 1})
}
GroupChatTopics.attachSchema(GroupChatTopicSchema)

export const GroupChatMessages = new Mongo.Collection('GroupChatMessages')
if (Meteor.isServer) {

}
GroupChatMessages.attachSchema(GroupChatMessageSchema)
