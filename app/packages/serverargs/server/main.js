import { Meteor } from 'meteor/meteor'
import { ServerArgs } from '../lib/collections'

Meteor.publish('serverArgs', function (args) {
  if (this.userId) {
    return ServerArgs.find({})
  } else {
    return []
  }
})
