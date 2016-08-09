import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { check } from 'meteor/check'
import { InfiniteScrollItems } from '../lib/collections'
import { ServerArgs } from '../../serverargs/lib/collections'

Meteor.publish('infiniteItems', function (args) {
  check(args, {
    limit: Number
  })
  if (this.userId && Roles.userIsInRole(this.userId, ['admin'])) {
    return InfiniteScrollItems.find({}, {limit: args.limit})
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('reactiveInfiniteItems', function (initialArgs) {
  // TODO polish
  console.log('initialArgs=')
  console.log(initialArgs)
  // Match.Maybe for optional vars
  check(initialArgs, {
    itemId: String,
    limit: Number
  })
  if (this.userId && Roles.userIsInRole(this.userId, ['admin'])) {
    let serverItemArgs = ServerArgs.findOne({'itemId': initialArgs.itemId})
    if (serverItemArgs) {
      console.log('updating serverargs for itemId \'' + initialArgs.itemId + '\'')
      ServerArgs.update({'_id': serverItemArgs._id}, {'itemId': initialArgs.itemId, args: initialArgs})
    } else {
      console.log('inserting serverargs for itemId \'' + initialArgs.itemId + '\'')
      ServerArgs.insert({'itemId': initialArgs.itemId, args: initialArgs})
    }
  }
  if (this.userId && Roles.userIsInRole(this.userId, ['admin'])) {
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
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('reactiveInfiniteItems2', function (initialArgs) {
  // TODO add UUID
  // TODO polish
  console.log('initialArgs=')
  console.log(initialArgs)
  // Match.Maybe for optional vars
  check(initialArgs, {
    limit: Number
  })
  let itemId = 'reactiveInfiniteItems2'
  if (this.userId && Roles.userIsInRole(this.userId, ['admin'])) {
    let serverItemArgs = ServerArgs.findOne({'itemId': itemId, createdBy: this.userId})
    if (serverItemArgs) {
      console.log('updating serverargs for itemId \'' + itemId + '\'')
      ServerArgs.update({'_id': serverItemArgs._id}, {'itemId': itemId, args: initialArgs})
    } else {
      console.log('inserting serverargs for itemId \'' + itemId + '\'')
      ServerArgs.insert({'itemId': itemId, createdBy: this.userId, args: initialArgs})
    }
    this.autorun(function () {
      let serverArgs = ServerArgs.findOne({'itemId': itemId, createdBy: this.userId})
      if (serverArgs) {
        console.log(serverArgs)
        console.log('serverArgs - sending ' + serverArgs.args.limit + ' items to the client')
        return [
          InfiniteScrollItems.find({}, { sort: {name: 1}, limit: serverArgs.args.limit })
        ]
      } else {
        console.log('serverargs for itemId \'' + itemId + '\' not present')
        console.log('initialArgs - sending ' + initialArgs.limit + ' items to the client')
        return [
          InfiniteScrollItems.find({}, { sort: {name: 1}, limit: initialArgs.limit })
        ]
      }
    })
    this.onStop(() => {
      ServerArgs.remove({'itemId': itemId, createdBy: this.userId})
    })
  } else {
    throw new Meteor.Error(401)
  }
})
