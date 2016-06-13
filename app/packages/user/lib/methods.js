import { Tags } from '../../tags/lib/collections'
import { Meteor } from 'meteor/meteor'

Meteor.methods({
  addTagToUser: function (tagLabel, tagValue, userId) {
    return Tags.insert({label: tagLabel, value: tagValue, parentId: userId, type: 'user'})
  },
  removeTagFromUser: function (tagId) {
    return Tags.remove({'_id': tagId})
  }
})
