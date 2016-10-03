import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Match } from 'meteor/check'

SimpleSchema.extendOptions({
  placeholder: Match.Optional(String)
})

export const GroupChatTopicSchema = new SimpleSchema({
  groupId: {
    type: String,
    label: 'GroupId',
    max: 40,
    min: 6
  },
  name: {
    type: String,
    label: 'Group chat topic',
    max: 250,
    min: 4,
    placeholder: 'Group chat topic...'
  },
  'participants.$.userId': {
    type: String
  },
  'participants.$.lastVisit': {
    type: Date
  }
})

export const GroupChatMessageSchema = new SimpleSchema({
  channelId: {
    type: String,
    label: 'ChannelId',
    max: 40,
    min: 6
  },
  from: {
    type: String,
    label: 'From',
    max: 40,
    min: 6,
    placeholder: 'From'
  },
  createdAt: {
    type: Date,
    label: 'Created at'
  },
  message: {
    type: String,
    label: 'Message',
    max: 3000,
    min: 1,
    placeholder: 'Message...'
  },
  'emotes.$.key': {
    type: String,
    label: 'EmotesKey',
    placeholder: 'EmotesKey'
  },
  'emotes.$.range': {
    type: [String],
    label: 'EmotesRange',
    placeholder: 'EmotesRange'
  },
  seenAt: {
    type: Date,
    label: 'Seen at',
    optional: true
  }
})
