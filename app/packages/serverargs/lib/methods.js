import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { Roles } from 'meteor/alanning:roles'
import { ServerArgs } from './collections'
import { rateLimit } from '../../../common/lib/rate-limit'

Meteor.methods({
  setArgs: function (args) {
    check(args, Match.Any)
    if (this.userId && Meteor.isServer && Roles.userIsInRole(this.userId, ['admin'])) {
      console.log(this.userId)
      let serverItemArgs = ServerArgs.findOne({itemId: args.itemId})
      console.log(serverItemArgs)
      if (serverItemArgs) {
        ServerArgs.update({'_id': serverItemArgs._id}, {'itemId': args.itemId, args: args})
      } else {
        ServerArgs.insert({'itemId': args.itemId, args: args})
      }
      return true
    }
    return false
  },
  setArgsReactiveInfiniteItems2: function (args) {
    check(args, Match.Any)
    if (this.userId && Meteor.isServer && Roles.userIsInRole(this.userId, ['admin'])) {
      let itemId = 'reactiveInfiniteItems2'
      ServerArgs.upsert({'itemId': itemId, createdBy: this.userId}, {'itemId': itemId, createdBy: this.userId, args: args})
      return true
    }
    return false
  },
  setArgsReactiveDocumentList: function (args) {
    check(args, {
      limit: Number,
      searchTerm: Match.Maybe(String),
      additionalMethodArgs: Match.Maybe([String])
    })
    if (args.additionalMethodArgs) {
      if (!args.searchTerm) {
        args.searchTerm = args.additionalMethodArgs[0]
        check(args.searchTerm, String)
      }
      delete args.additionalMethodArgs
    }
    if (this.userId && Meteor.isServer) {
      let itemId = 'reactiveDocumentList'
      ServerArgs.upsert({'itemId': itemId, createdBy: this.userId}, {'itemId': itemId, createdBy: this.userId, args: args})
      return true
    }
    return false
  }
})

rateLimit({
  methods: [
    'setArgs',
    'setArgsReactiveInfiniteItems2',
    'setArgsReactiveDocumentList'
  ],
  limit: 20,
  timeRange: 10000
})
