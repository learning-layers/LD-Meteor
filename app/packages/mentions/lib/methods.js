import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

Meteor.methods({
  getMentions: function (args) {
    check(args, {
      mentionSearch: String
    })
    if (args.mentionSearch.length >= 4) {
      return Meteor.users.find({ 'profile.name': { $regex: '^' + args.mentionSearch, $options: 'i' } }).fetch()
    } else {
      return []
    }
  }
})
