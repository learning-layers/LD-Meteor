import { Meteor } from 'meteor/meteor'
import { GroupChatTopics } from './collections'
import { GroupChatTopicSchema } from './schema'
import { check } from 'meteor/check'
import { rateLimit } from '../../../common/lib/rate-limit'

Meteor.methods({
  createGroupChatTopic: function (newGroupChatTopic) {
    check(newGroupChatTopic, GroupChatTopicSchema)
    if (this.userId) {
      return GroupChatTopics.insert(newGroupChatTopic)
    } else {
      throw new Meteor.Error(401)
    }
  }
})

rateLimit({
  methods: [
    'createGroupChatTopic'
  ],
  limit: 1,
  timeRange: 3000
})
