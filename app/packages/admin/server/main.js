import { Meteor } from 'meteor/meteor'

Meteor.publish('userList', function () {
  return Meteor.users.find({})
})
