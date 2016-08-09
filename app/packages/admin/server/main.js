import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { USERS_DEFAULT } from '../../user/server/userProjections'

Meteor.publish('userList', function () {
  return Meteor.users.find({}, USERS_DEFAULT)
})

Meteor.publish('user', function (args) {
  check(args, {
    userId: String
  })
  return Meteor.users.find({'_id': args.userId}, USERS_DEFAULT)
})
