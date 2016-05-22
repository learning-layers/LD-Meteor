import { Meteor } from 'meteor/meteor'
import { InfiniteScrollItems } from '../lib/collections'
import { ServerArgs } from '../../serverargs/lib/collections'

Meteor.publish('infiniteItems', function (args) {
  return InfiniteScrollItems.find({}, {limit: args.limit})
})

Meteor.publish('reactiveInfiniteItems', function (initialArgs) {
  // TODO polish
  console.log('initialArgs=')
  console.log(initialArgs)
  if (this.userId) {
    let serverItemArgs = ServerArgs.findOne({'itemId': initialArgs.itemId})
    if (serverItemArgs) {
      console.log('updating serverargs for itemId \'' + initialArgs.itemId + '\'')
      ServerArgs.update({'_id': serverItemArgs._id}, {'itemId': initialArgs.itemId, args: initialArgs})
    } else {
      console.log('inserting serverargs for itemId \'' + initialArgs.itemId + '\'')
      ServerArgs.insert({'itemId': initialArgs.itemId, args: initialArgs})
    }
  }
  this.autorun(function () {
    let serverArgs = ServerArgs.findOne({'itemId': initialArgs.itemId})
    if (serverArgs) {
      console.log(serverArgs)
      console.log('serverArgs - sending ' + serverArgs.args.limit + ' items to the client')
      return [
        InfiniteScrollItems.find({}, { limit: serverArgs.args.limit })
      ]
    } else {
      console.log('serverargs for itemId \'' + initialArgs.itemId + '\' not present')
      console.log('initialArgs - sending ' + initialArgs.limit + ' items to the client')
      return [
        InfiniteScrollItems.find({}, { limit: initialArgs.limit })
      ]
    }
  })
  this.onStop(function () {
    ServerArgs.remove({'itemId': initialArgs.itemId})
  })
})
