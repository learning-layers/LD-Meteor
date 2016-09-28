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
  },
  modifiedAt: {
    type: Date,
    label: 'Modified at',
    optional: true
  },
  etherpadGroup: {
    type: String,
    label: 'etherpadGroup',
    max: 100,
    min: 1,
    optional: true
  },
  etherpadGroupPad: {
    type: String,
    label: 'etherpadGroupPad',
    max: 100,
    min: 1,
    optional: true
  },
  etherpadReadOnlyId: {
    type: String,
    label: 'etherpadReadOnlyId',
    max: 100,
    min: 1,
    optional: true
  },
  isSubDocument: {
    type: Boolean,
    label: 'IsSubDocument',
    optional: true
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
  parents: {
    type: [String],
    optional: true
  },
  mentions: {
    type: [String],
    optional: true
  },
  modifiedAt: {
    type: Date,
    label: 'Modified at',
    optional: true
  },
  movedToRevisionsAt: {
    type: Date,
    label: 'Moved to revisions at',
    optional: true
  },
  revisionOf: {
    type: String,
    label: 'RevisionId',
    max: 40,
    min: 6,
    optional: true
  }
})

export const DocumentAccessSchema = new SimpleSchema({
  documentId: {
    type: String,
    label: 'DocumentId',
    max: 40,
    min: 6
  },
  'linkCanEdit.linkId': {
    type: String
  },
  'linkCanEdit.addedBy': {
    type: String
  },
  'linkCanEdit.addedOn': {
    type: Date
  },
  'linkCanComment.linkId': {
    type: String
  },
  'linkCanComment.addedBy': {
    type: String
  },
  'linkCanComment.addedOn': {
    type: Date
  },
  'linkCanView.linkId': {
    type: String
  },
  'linkCanView.addedBy': {
    type: String
  },
  'linkCanView.addedOn': {
    type: Date
  },
  'userCanView.$.userId': {
    type: String
  },
  'userCanView.$.addedBy': {
    type: String
  },
  'userCanView.$.addedOn': {
    type: Date
  },
  'userCanComment.$.userId': {
    type: String
  },
  'userCanComment.$.addedBy': {
    type: String
  },
  'userCanComment.$.addedOn': {
    type: Date
  },
  'userCanEdit.$.userId': {
    type: String
  },
  'userCanEdit.$.addedBy': {
    type: String
  },
  'userCanEdit.$.addedOn': {
    type: Date
  },
  'groupCanView.$.groupId': {
    type: String
  },
  'groupCanView.$.addedBy': {
    type: String
  },
  'groupCanView.$.addedOn': {
    type: Date
  },
  'groupCanComment.$.groupId': {
    type: String
  },
  'groupCanComment.$.addedBy': {
    type: String
  },
  'groupCanComment.$.addedOn': {
    type: Date
  },
  'groupCanEdit.$.groupId': {
    type: String
  },
  'groupCanEdit.$.addedBy': {
    type: String
  },
  'groupCanEdit.$.addedOn': {
    type: Date
  }
})

export const DocumentSelectionSchema = new SimpleSchema({
  parentId: {
    type: String,
    label: 'ParentId',
    max: 40,
    min: 6
  },
  documentId: {
    type: String,
    label: 'ParentId',
    max: 40,
    min: 6,
    optional: true // TODO change this to be mandatory
  },
  startOffset: {
    type: Number,
    label: 'StartOffset'
  },
  endOffset: {
    type: Number,
    label: 'EndOffset'
  },
  htmlContent: {
    type: String,
    label: 'content'
  }
})
