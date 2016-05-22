import { Meteor } from 'meteor/meteor'

Meteor.publish('userList', function () {
  return Meteor.users.find({})
})

Meteor.publish('user', function (args) {
  return Meteor.users.find({'_id': args.userId})
})
