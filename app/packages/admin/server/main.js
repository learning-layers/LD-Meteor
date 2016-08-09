import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Roles } from 'meteor/alanning:roles'
import { USERS_DEFAULT } from '../../user/server/userProjections'

Meteor.publish('userList', function () {
  if (this.userId && Roles.userIsInRole(this.userId, ['admin'])) {
    return Meteor.users.find({}, USERS_DEFAULT)
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('user', function (args) {
  check(args, {
    userId: String
  })
  if (this.userId) {
    return Meteor.users.find({'_id': args.userId}, USERS_DEFAULT)
  } else {
    throw new Meteor.Error(401)
  }
})
