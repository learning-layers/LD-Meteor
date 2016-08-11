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
  }
})
