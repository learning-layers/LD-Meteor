import { Meteor } from 'meteor/meteor'
import { Groups } from '../../groups/lib/collections'
import { GroupChatTopics, GroupChatMessages } from './collections'
import { GroupChatTopicSchema } from './schema'
import { check } from 'meteor/check'
import { rateLimit } from '../../../common/lib/rate-limit'

const checkIfUserIsAMember = function (members, userId) {
  for (var i = 0, len = members.length; i < len; i++) {
    if (members[i].id === userId) {
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

Meteor.methods({
  createGroupChatTopic: function (newGroupChatTopic) {
    check(newGroupChatTopic, GroupChatTopicSchema)
    if (this.userId) {
      if (isMemberInGroup(newGroupChatTopic.groupId, this.userId)) {
        return GroupChatTopics.insert(newGroupChatTopic)
      } else {
        throw new Meteor.Error(401)
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  sendGroupMessage: function (groupId, topicId, messageText) {
    check(groupId, String)
    check(topicId, String)
    check(messageText, String)
    if (this.userId) {
      const newGroupChatMessage = {
        channelId: topicId,
        message: messageText,
        createdAt: new Date(),
        from: this.userId,
        emotes: []
      }
      return GroupChatMessages.insert(newGroupChatMessage)
    } else {
      throw new Meteor.Error(401)
    }
  }
})

rateLimit({
  methods: [
    'createGroupChatTopic',
    'sendGroupMessage'
  ],
  limit: 1,
  timeRange: 3000
})
