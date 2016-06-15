import { Tags } from '../../tags/lib/collections'
import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import { UserProfileSchema } from '../lib/schema'

Meteor.methods({
  addTagToUser: function (tagLabel, tagValue, userId) {
    if (this.userId) {
      return Tags.insert({label: tagLabel, value: tagValue, parentId: userId, type: 'user'})
    } else {
      throw new Meteor.Error(401)
    }
  },
  removeTagFromUser: function (tagId) {
    if (this.userId) {
      return Tags.remove({'_id': tagId})
    } else {
      throw new Meteor.Error(401)
    }
  },
  sendNewProfileInfoData: function (newDisplayName, newFullName, newDescription) {
    if (this.userId) {
      const isValid = Match.test({
        displayName: newDisplayName,
        fullName: newFullName,
        description: newDescription
      }, UserProfileSchema)
      if (isValid) {
        return Meteor.users.update({ '_id': this.userId }, {
          $set: {
            'profile.name': newDisplayName,
            'profile.fullName': newFullName,
            'profile.description': newDescription
          }
        })
      } else {
        console.log(isValid)
        throw new Meteor.Error(400, 'Provided new profile data is invalid')
      }
    } else {
      throw new Meteor.Error(401)
    }
  }
})
