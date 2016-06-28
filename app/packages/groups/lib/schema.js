import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Match } from 'meteor/check'

SimpleSchema.extendOptions({
  placeholder: Match.Optional(String)
})

export const GroupSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Group name',
    max: 150,
    min: 4,
    placeholder: 'Enter team name ...'
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
  },
  modifiedAt: {
    type: Date,
    label: 'Modified at',
    optional: true
  },
  members: {
    type: [String]
  }
})
