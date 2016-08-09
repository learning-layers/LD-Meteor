import { Meteor } from 'meteor/meteor'
import { Groups } from '../lib/collections'
import { check, Match } from 'meteor/check'
import { USERS_DEFAULT } from '../../user/server/userProjections'

Meteor.publish('ownGroupsList', function () {
  // TODO add projections here:
  // { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 }
  if (this.userId) {
    return Groups.find({'createdBy': this.userId})
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('groupList', function (args) {
  // TODO add projections here:
  // { name: 1, createdBy: 1, createdAt: 1, modifiedAt: 1 }
  check(args, Match.OneOf({ groupIds: [String] }, undefined))
  if (this.userId) {
    this.autorun(function () {
      if (args && args.groupIds) {
        const groups = Groups.find({'_id': {$in: args.groupIds}})
        let userIds = []
        groups.forEach(function (group) {
          userIds.push(group.createdBy)
        })
        return [
          Meteor.users.find({ '_id': { $in: userIds } }, USERS_DEFAULT),
          Groups.find({'_id': {$in: args.groupIds}})
        ]
      } else {
        const groupMemberships = Groups.find({ 'members.userId': this.userId })
        let userIds = []
        groupMemberships.forEach(function (groupMembership) {
          userIds.push(groupMembership.createdBy)
        })
        return [
          Meteor.users.find({ '_id': { $in: userIds } }, USERS_DEFAULT),
          Groups.find({ 'members.userId': this.userId })
        ]
      }
    })
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('groupMemberList', function (args) {
  check(args, {
    groupId: String
  })
  if (this.userId) {
    const groups = Groups.find({'_id': args.groupId})
    let userIds = []
    groups.forEach(function (group) {
      userIds.push(group.createdBy)
      group.members.forEach(function (member) {
        userIds.push(member.userId)
      })
    })
    return Groups.find({'_id': args.groupId})
  } else {
    throw new Meteor.Error(401)
  }
})
