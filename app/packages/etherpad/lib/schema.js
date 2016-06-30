import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const EtherpadSessionSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Document title',
    max: 300,
    min: 4,
    placeholder: 'Enter document title ...'
  }
})
