import { Meteor } from 'meteor/meteor'

Meteor.methods({
  'getServerTimeLD': function () {
    if (Meteor.isServer) {
      return Date.now()
    }
  }
})
