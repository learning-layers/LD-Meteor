import { Meteor } from 'meteor/meteor'
import { Groups } from '../lib/collections'

Meteor.publish('ownGroupsList', function () {
  // TODO add projections here:
  // { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 }
  return Groups.find({'createdBy': this.userId})
})

Meteor.publish('groupList', function (args) {
  // TODO add projections here:
  // { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 }
  this.autorun(function () {
    if (args && args.groupIds) {
      const groups = Groups.find({'_id': {$in: args.groupIds}})
      let userIds = []
      groups.forEach(function (group) {
        userIds.push(group.createdBy)
      })
      return [
        Meteor.users.find({ '_id': { $in: userIds } }),
        Groups.find({'_id': {$in: args.groupIds}})
      ]
    } else {
      const groupMemberships = Groups.find({ 'members.userId': this.userId })
      let userIds = []
      groupMemberships.forEach(function (groupMembership) {
        userIds.push(groupMembership.createdBy)
      })
      return [
        Meteor.users.find({ '_id': { $in: userIds } }),
        Groups.find({ 'members.userId': this.userId })
      ]
    }
  })
})

Meteor.publish('groupMemberList', function (args) {
  const groups = Groups.find({'_id': args.groupId})
  let userIds = []
  groups.forEach(function (group) {
    userIds.push(group.createdBy)
    group.members.forEach(function (member) {
      userIds.push(member.userId)
    })
  })
  return Groups.find({'_id': args.groupId})
})
