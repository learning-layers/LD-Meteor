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
