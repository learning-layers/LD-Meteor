import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const NotificationSettingSchema = new SimpleSchema({
  messageId: {
    type: String,
    label: 'MessageId',
    max: 25,
    min: 2
  },
  userId: {
    type: String,
    label: 'UserId',
    max: 40,
    min: 6
  },
  on: {
    type: Boolean,
    label: 'On'
  },
  intervalKey: {
    type: String,
    label: 'IntervalKey',
    max: 40,
    min: 2
  },
  additionalValues: {
    type: String,
    label: 'AdditionalValues',
    max: 250,
    optional: true
  }
})
