import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { NotificationSettings, notificationSettingsOptions, emailIntervalOptions } from '../lib/collections'

let isAValidNotificationSetting = Match.Where(function (x) {
  check(x, String)
  let found = false
  notificationSettingsOptions.forEach(function (notificationSettingsOption) {
    if (notificationSettingsOption.key === x) {
      found = true
    }
  })
  return found
})

let isAValidIntervalSetting = Match.Where(function (x) {
  check(x, String)
  let found = false
  emailIntervalOptions.forEach(function (emailIntervalOption) {
    if (emailIntervalOption.key === x) {
      found = true
    }
  })
  return found
})

Meteor.methods({
  changeNotificationSetting (notificationName, on, intervalKey, additionalValues) {
    check(notificationName, isAValidNotificationSetting)
    check(on, Boolean)
    check(intervalKey, isAValidIntervalSetting)
    check(additionalValues, Match.OneOf(String, undefined))
    if (this.userId) {
      if (additionalValues) {
        NotificationSettings.upsert({userId: this.userId, messageId: notificationName}, {$set: {
          userId: this.userId,
          messageId: notificationName,
          on: on,
          intervalKey: intervalKey,
          additionalValues: additionalValues
        }})
      } else {
        NotificationSettings.upsert({userId: this.userId, messageId: notificationName}, {$set: {
          userId: this.userId,
          messageId: notificationName,
          on: on,
          intervalKey: intervalKey
        }})
      }
    } else {
      throw new Meteor.Error(401)
    }
  }
})
