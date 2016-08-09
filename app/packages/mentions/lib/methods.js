import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

Meteor.methods({
  getMentions: function (args) {
    check(args, {
      mentionSearch: String
    })
    if (this.userId && args.mentionSearch.length >= 4) {
      if (Meteor.isServer) {
        let { USERS_DEFAULT } = require('../../user/server/userProjections')
        return Meteor.users.find({ 'profile.name': { $regex: '^' + args.mentionSearch, $options: 'i' } }, USERS_DEFAULT).fetch()
      } else {
        return Meteor.users.find({ 'profile.name': { $regex: '^' + args.mentionSearch, $options: 'i' } }).fetch()
      }
    } else if (this.userId) {
      return []
    } else {
      throw new Meteor.Error(401)
    }
  }
})
