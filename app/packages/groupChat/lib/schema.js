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
