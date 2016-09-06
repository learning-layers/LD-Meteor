import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const DocumentHistoryItemSchema = new SimpleSchema({
  type: {
    type: String,
    label: 'Type',
    max: 100,
    min: 4
  },
  message: {
    type: String,
    label: 'Message',
    max: 300,
    min: 4
  },
  createdBy: {
    type: String,
    label: 'Created by',
    max: 40,
    min: 6
  },
  createdAt: {
    type: Date,
    label: 'Created at'
  }
})
