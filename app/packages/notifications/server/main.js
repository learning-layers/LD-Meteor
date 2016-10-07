import { Meteor } from 'meteor/meteor'
import { NotificationSettings, notificationSettingsOptions } from '../lib/collections'

Meteor.publish('notificationSettings', function () {
  if (this.userId) {
    let notificationSettings = NotificationSettings.find({userId: this.userId}).fetch()
    let notificationSettingsOptionsCopy = JSON.parse(JSON.stringify(notificationSettingsOptions))
    notificationSettings.forEach(function (notificationSettingsItem) {
      notificationSettingsOptionsCopy.forEach(function (notificationSettingOption) {
        if (notificationSettingOption.key === notificationSettingsItem.messageId) {
          notificationSettingOption.isSet = true
        }
      })
    })
    notificationSettingsOptionsCopy.forEach((notificationSettingOption) => {
      if (!notificationSettingOption.isSet) {
        // create default notification setting for this user
        if (notificationSettingOption.default.additionalValues) {
          NotificationSettings.insert({
            messageId: notificationSettingOption.key,
            userId: this.userId,
            on: notificationSettingOption.default.on,
            intervalKey: notificationSettingOption.default.intervalKey,
            additionalValues: notificationSettingOption.default.additionalValues
          })
        } else {
          NotificationSettings.insert({
            messageId: notificationSettingOption.key,
            userId: this.userId,
            on: notificationSettingOption.default.on,
            intervalKey: notificationSettingOption.default.intervalKey
          })
        }
      }
    })
    return NotificationSettings.find({userId: this.userId})
  } else {
    throw new Meteor.Error(401)
  }
})
