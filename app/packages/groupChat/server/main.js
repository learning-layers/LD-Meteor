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

Meteor.publish('groupChannelMessages', function (args) {
  console.log('groupChannelMessages=', args)
  check(args, {
    groupId: String,
    channelId: String
  })
  const group = Groups.findOne({_id: args.groupId})
  if (group) {
    if (isMemberInGroup(group._id, this.userId)) {
      const channel = GroupChatTopics.find({_id: args.channelId, groupId: args.groupId}).fetch()
      if (channel) {
        console.log('Delivering group channel messages (1)')
        let userIds = []
        userIds.push(group.createdBy)
        if (group.members) {
          group.members.forEach(function (member) {
            userIds.push(member.userId)
          })
        }
        console.log('Delivering group channel messages (2) =', userIds)
        console.log('Delivering group channel messages (3)')
        return [
          Meteor.users.find({_id: {$in: userIds}}, USERS_DEFAULT),
          GroupChatMessages.find({channelId: args.channelId})
        ]
      } else {
        console.log('No topic found for the given topic id')
        throw new Meteor.Error(404, 'No topic found for the given topic id')
      }
    } else {
      console.log('Unauthorized')
      throw new Meteor.Error(401)
    }
  } else {
    console.log('No group found for the given group id')
    throw new Meteor.Error(404, 'No group found for the given group id')
  }
})
