import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const UserPositionSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'UserId',
    max: 40,
    min: 6
  },
  type: {
    type: String,
    label: 'Type',
    max: 10,
    min: 3
  },
  elementId: {
    type: String,
    label: 'UserId',
    max: 40,
    min: 6
  }
})

export const UserActivityHistorySchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'UserId',
    max: 40,
    min: 6
  },
  type: {
    type: String,
    label: 'Type',
    max: 10,
    min: 3
  },
  elementId: {
    type: String,
    label: 'UserId',
    max: 40,
    min: 6
  },
  action: {
    type: String,
    label: 'Action',
    max: 5000,
    min: 3
  },
  createdAt: {
    type: Date,
    label: 'Created at'
  },
  values: {
    type: [String],
    label: 'Values',
    optional: true
  }
})
