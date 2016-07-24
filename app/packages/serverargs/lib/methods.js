import { Meteor } from 'meteor/meteor'
import { ServerArgs } from './collections'

Meteor.methods({
  setArgs: function (args) {
    if (this.userId && Meteor.isServer) {
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
    if (this.userId && Meteor.isServer) {
      let itemId = 'reactiveInfiniteItems2'
      console.log(this.userId)
      let serverItemArgs = ServerArgs.findOne({itemId: itemId, createdBy: this.userId})
      console.log(serverItemArgs)
      if (serverItemArgs) {
        ServerArgs.update({'_id': serverItemArgs._id, createdBy: this.userId}, {'itemId': itemId, createdBy: this.userId, args: args})
      } else {
        ServerArgs.insert({'itemId': itemId, createdBy: this.userId, args: args})
      }
      return true
    }
    return false
  }
})
