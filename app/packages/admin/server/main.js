import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

Meteor.publish('userList', function () {
  return Meteor.users.find({})
})

Meteor.publish('user', function (args) {
  check(args, {
    userId: String
  })
  return Meteor.users.find({'_id': args.userId})
})
