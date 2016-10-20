import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { NotificationSettingSchema } from './schema'

export const NotificationSettings = new Mongo.Collection('NotificationSettings')
NotificationSettings.attachSchema(NotificationSettingSchema)
if (Meteor.isServer) {
  NotificationSettings._ensureIndex({ userId: 1, messageId: 1 })
}

let _notificationSettingsOptions = []
_notificationSettingsOptions.push({key: 'docCommentMentions', default: {on: true, intervalKey: 'instantly'}})
_notificationSettingsOptions.push({key: 'docContentChange', default: {on: true, intervalKey: 'hourly'}})
_notificationSettingsOptions.push({key: 'docNewComment', default: {on: true, intervalKey: 'instantly'}})
_notificationSettingsOptions.push({key: 'docNewSubdocument', default: {on: true, intervalKey: 'instantly'}})
_notificationSettingsOptions.push({key: 'docNewAttachment', default: {on: true, intervalKey: 'instantly'}})
_notificationSettingsOptions.push({key: 'directChatNewMsg', default: {on: true, intervalKey: 'instantly'}})
_notificationSettingsOptions.push({key: 'groupChatAutoSubscribe', default: {on: false, intervalKey: 'hourly', additionalValues: '{"autosubscribeToChannels": false}'}})
export const notificationSettingsOptions = _notificationSettingsOptions

let _emailIntervalOptions = [
  {label: 'instantly', key: 'instantly'},
  {label: 'hourly', key: 'hourly'},
  {label: 'every two hours', key: 'twohourly'},
  {label: 'every four hours', key: 'fourhourly'},
  {label: 'daily', key: 'daily'},
  {label: 'weekly monday', key: 'weeklymon'},
  {label: 'weekly friday', key: 'weeklyfri'},
  {label: 'weekly wednesday', key: 'weeklywed'}
]
export const emailIntervalOptions = _emailIntervalOptions
