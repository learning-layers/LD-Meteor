import { Meteor } from 'meteor/meteor'
import { Tags } from '../../tags/lib/collections'
import { check } from 'meteor/check'
import { USERS_DEFAULT } from './userProjections'

Meteor.publish('userTags', function (args) {
  check(args, {
    userId: String
  })
  if (this.userId) {
    return Tags.find({ parentId: args.userId, type: 'user' })
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('userprofile', function (args) {
  // TODO add projections here:
  // { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 }
  check(args, {
    userId: String
  })
  if (this.userId) {
    return Meteor.users.find({'_id': args.userId}, USERS_DEFAULT)
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('userprofiles', function (args) {
  // TODO add projections here:
  // { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 }
  check(args, {
    userIds: [String]
  })
  if (this.userId) {
    return Meteor.users.find({'_id': {$in: args.userIds}}, USERS_DEFAULT)
  } else {
    throw new Meteor.Error(401)
  }
})
