import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Match } from 'meteor/check'

SimpleSchema.extendOptions({
  placeholder: Match.Optional(String)
})

export const DocumentSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Document title',
    max: 300,
    min: 6,
    placeholder: 'Enter document title ...'
  }
})
