import { Meteor } from 'meteor/meteor'
import { Tags } from '../../tags/lib/collections'

Meteor.publish('userTags', function (args) {
  return Tags.find({})
})
