import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { GroupChatTopics, GroupChatMessages } from '../lib/collections'
import { Groups } from '../../groups/lib/collections'
import { USERS_DEFAULT } from '../../user/server/userProjections'

const checkIfUserIsAMember = function (members, userId) {
  for (var i = 0, len = members.length; i < len; i++) {
    if (members[i].userId === userId) {
      return true
    }
  }
  return false
}

const isMemberInGroup = function (groupId, userId) {
  const group = Groups.findOne({ _id: groupId })
  if (group) {
    return group.createdBy === userId || checkIfUserIsAMember(group.members, userId)
  } else {
    return false
  }
}

Meteor.publish('groupChannels', function (args) {
  check(args, {
    groupId: String
  })
  const group = Groups.findOne({_id: args.groupId})
  if (group) {
    if (isMemberInGroup(group._id, this.userId)) {
      return GroupChatTopics.find({groupId: args.groupId})
    } else {
      throw new Meteor.Error(401)
    }
  } else {
    throw new Meteor.Error(404)
  }
})

Meteor.publish('groupChannel', function (args) {
  check(args, {
    groupId: String,
    channelId: String
  })
  const group = Groups.findOne({_id: args.groupId})
  if (group) {
    if (isMemberInGroup(group._id, this.userId)) {
      return GroupChatTopics.find({_id: args.channelId})
    } else {
      throw new Meteor.Error(401, 'You are not a member of this group!')
    }
  } else {
    throw new Meteor.Error(404)
  }
})

Meteor.publish('groupChannelMessages', function (args) {
  check(args, {
    groupId: String,
    channelId: String
  })
  const group = Groups.findOne({_id: args.groupId})
  if (group) {
    if (isMemberInGroup(group._id, this.userId)) {
      const channel = GroupChatTopics.find({_id: args.channelId, groupId: args.groupId}).fetch()
      if (channel) {
        this.onStop(() => {
          GroupChatTopics.update({_id: args.channelId, groupId: args.groupId}, {$pull: {participants: {userId: this.userId}}})
          GroupChatTopics.update({_id: args.channelId, groupId: args.groupId}, {$push: {participants: {userId: this.userId, lastVisit: new Date()}}})
        })
        let userIds = []
        userIds.push(group.createdBy)
        if (group.members) {
          group.members.forEach(function (member) {
            userIds.push(member.userId)
          })
        }
        return [
          Meteor.users.find({_id: {$in: userIds}}, USERS_DEFAULT),
          GroupChatMessages.find({channelId: args.channelId})
        ]
      } else {
        throw new Meteor.Error(404, 'No topic found for the given topic id')
      }
    } else {
      throw new Meteor.Error(401)
    }
  } else {
    throw new Meteor.Error(404, 'No group found for the given group id')
  }
})
