import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const FriendRequestSchema = new SimpleSchema({
  requester: {
    type: String,
    label: 'Requester',
    max: 40,
    min: 6,
    placeholder: 'Requester'
  },
  user: {
    type: String,
    label: 'User',
    max: 40,
    min: 6,
    placeholder: 'User'
  },
  status: {
    type: String,
    label: 'Status',
    max: 10,
    placeholder: 'Status'
  },
  createdAt: {
    type: Date,
    label: 'Created at'
  },
  modifiedAt: {
    type: Date,
    label: 'Modified at',
    optional: true
  }
})

export const FriendListSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'User',
    max: 40,
    min: 6,
    placeholder: 'User'
  },
  'groups.$.name': {
    type: String,
    label: 'GroupName',
    placeholder: 'GroupName'
  },
  'groups.$.friendIds': {
    type: [String],
    label: 'GroupFriendIds',
    placeholder: 'GroupFriendIds'
  },
  friendIds: {
    type: [String],
    label: 'FriendIds',
    placeholder: 'FriendIds'
  }
})

export const DirectMessageSchema = new SimpleSchema({
  from: {
    type: String,
    label: 'From',
    max: 40,
    min: 6,
    placeholder: 'From'
  },
  to: {
    type: String,
    label: 'To',
    max: 40,
    min: 6,
    placeholder: 'To'
  },
  createdAt: {
    type: Date,
    label: 'Created at'
  },
  message: {
    type: String,
    label: 'To',
    max: 3000,
    min: 6,
    placeholder: 'To'
  },
  seenAt: {
    type: Date,
    label: 'Seen at',
    optional: true
  }
})
