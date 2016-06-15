import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const UserProfileSchema = new SimpleSchema({
  displayName: {
    type: String,
    label: 'Change Displayname',
    max: 60,
    min: 4,
    placeholder: 'Enter Displayname ...'
  },
  fullName: {
    type: String,
    label: 'Full Name',
    max: 200,
    min: 2,
    placeholder: 'Enter Full Name ...',
    optional: true
  },
  description: {
    type: String,
    label: 'Description',
    max: 1000,
    placeholder: 'Enter Description ...',
    optional: true
  }
})
