import { Meteor } from 'meteor/meteor'
import { Groups } from '../lib/collections'

Meteor.publish('groupList', function () {
  return Groups.find({'createdBy': this.userId}, { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 })
})

Meteor.publish('groupMemberList', function (args) {
  return Groups.find({'_id': args.groupId})
})
