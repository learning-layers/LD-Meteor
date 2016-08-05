import { Meteor } from 'meteor/meteor'
import { Tags } from '../../tags/lib/collections'
import { check } from 'meteor/check'

Meteor.publish('userTags', function (args) {
  check(args, {
    userId: String
  })
  return Tags.find({ parentId: args.userId, type: 'user' })
})

Meteor.publish('userprofile', function (args) {
  // TODO add projections here:
  // { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 }
  check(args, {
    userId: String
  })
  return Meteor.users.find({'_id': args.userId})
})

Meteor.publish('userprofiles', function (args) {
  // TODO add projections here:
  // { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 }
  check(args, {
    userIds: [String]
  })
  return Meteor.users.find({'_id': {$in: args.userIds}})
})
