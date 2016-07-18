import { Meteor } from 'meteor/meteor'
import { Tags } from '../../tags/lib/collections'

Meteor.publish('userTags', function (args) {
  return Tags.find({ parentId: args.userId, type: 'user' })
})

Meteor.publish('userprofile', function (args) {
  // TODO add projections here:
  // { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 }
  return Meteor.users.find({'_id': args.userId})
})

Meteor.publish('userprofiles', function (args) {
  // TODO add projections here:
  // { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 }
  return Meteor.users.find({'_id': {$in: args.userIds}})
})
