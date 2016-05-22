import { Meteor } from 'meteor/meteor'
import { InfiniteScrollItems } from '../lib/collections'

Meteor.publish('infiniteItems', function (args) {
  return InfiniteScrollItems.find({}, {limit: args.limit})
})
