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
    min: 4,
    placeholder: 'Enter document title ...'
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

export const DocumentCommentSchema = new SimpleSchema({
  documentId: {
    type: String,
    label: 'DocumentId',
    max: 40,
    min: 6
  },
  text: {
    type: String,
    label: 'Comment text',
    max: 2000,
    min: 4,
    placeholder: 'Enter comment ... (Mention people using \'@\')'
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
  parent: {
    type: [String],
    optional: true
  }
})
