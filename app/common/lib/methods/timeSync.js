import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

Meteor.methods({
  'getServerTimeLD': function (clientTime) {
    check(clientTime, Date)
    if (Meteor.isServer && clientTime) {
      return clientTime
    }
  }
})
