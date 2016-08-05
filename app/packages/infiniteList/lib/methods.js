import { Meteor } from 'meteor/meteor'
import { InfiniteScrollItems } from './collections'
import { check } from 'meteor/check'

Meteor.methods({
  insertInfiniteScrollTestData: function () {
    console.log('trying to insert test items')
    let itemCount = InfiniteScrollItems.find({}).count()
    console.log('test items in db: ' + itemCount)
    if (itemCount < 1000 && Meteor.isServer) {
      console.log('inserting test items')
      for (var i = 0; i < 20000; i++) {
        InfiniteScrollItems.insert({ name: i })
      }
    } else {
      console.log('test items already present')
    }
  },
  getItems: function (offset, amount) {
    check(offset, Number)
    check(amount, Number)
    return InfiniteScrollItems.find({}, { skip: offset, limit: amount }).fetch()
  }
})
