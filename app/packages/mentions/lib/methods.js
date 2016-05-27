import { Meteor } from 'meteor/meteor'

Meteor.methods({
  getMentions: function (args) {
    if (args.mentionSearch.length >= 4) {
      return Meteor.users.find({ 'profile.name': { $regex: '^' + args.mentionSearch, $options: 'i' } }).fetch()
    } else {
      return []
    }
  }
})
