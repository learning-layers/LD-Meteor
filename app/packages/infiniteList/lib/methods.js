import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Roles } from 'meteor/alanning:roles'
import { InfiniteScrollItems } from './collections'

Meteor.methods({
  insertInfiniteScrollTestData: function () {
    console.log('trying to insert test items')
    let itemCount = InfiniteScrollItems.find({}).count()
    console.log('test items in db: ' + itemCount)
    if (itemCount < 1000 && Meteor.isServer && Roles.userIsInRole(this.userId, ['admin'])) {
      console.log('inserting test items')
      for (var i = 0; i < 20000; i++) {
        InfiniteScrollItems.insert({ name: i })
      }
    } else if (itemCount >= 1000 && Meteor.isServer && Roles.userIsInRole(this.userId, ['admin'])) {
      console.log('test items already present')
    } else {
      throw new Meteor.Error(401)
    }
  },
  getItems: function (offset, amount) {
    check(offset, Number)
    check(amount, Number)
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      return InfiniteScrollItems.find({}, { skip: offset, limit: amount }).fetch()
    } else {
      throw new Meteor.Error(401)
    }
  }
})
