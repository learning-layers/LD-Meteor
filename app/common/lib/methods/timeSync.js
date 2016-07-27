import { Meteor } from 'meteor/meteor'

Meteor.methods({
  'getServerTimeLD': function (args) {
    if (Meteor.isServer && args && args.clientTime) {
      return args.clientTime
    }
  }
})
