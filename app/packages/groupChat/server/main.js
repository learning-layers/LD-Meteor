import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { GroupChatTopics } from '../lib/collections'

Meteor.publish('groupChannels', function (args) {
  check(args, {
    groupId: String
  })
  return GroupChatTopics.find({groupId: args.groupId})
})
