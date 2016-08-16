import { Meteor } from 'meteor/meteor'
import { Groups } from '../lib/collections'
import { check, Match } from 'meteor/check'
import { USERS_DEFAULT } from '../../user/server/userProjections'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

Meteor.publish('ownGroupsList', function () {
  if (this.userId) {
    return Groups.find({'createdBy': this.userId})
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('groupList', function (args) {
  check(args, Match.OneOf({ groupIds: [String] }, undefined))
  if (this.userId) {
    this.autorun(function () {
      if (args && args.groupIds) {
        const groups = Groups.find({'_id': {$in: args.groupIds}}, { name: 1, createdBy: 1 })
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

DDPRateLimiter.addRule({
  name: 'ownGroupsList',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)

DDPRateLimiter.addRule({
  name: 'groupList',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)

DDPRateLimiter.addRule({
  name: 'groupMemberList',
  type: 'subscription',
  connectionId () { return true }
}, 5, 1000)
