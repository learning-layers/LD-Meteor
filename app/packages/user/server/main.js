import { Meteor } from 'meteor/meteor'
import { Tags } from '../../tags/lib/collections'

Meteor.publish('userTags', function (args) {
  return Tags.find({ parentId: args.userId, type: 'user' })
})

Meteor.publish('userprofile', function (args) {
  return Meteor.users.find({'_id': args.userId})
})
