import { Meteor } from 'meteor/meteor'
import { Groups } from './collections'
import { GroupSchema } from './schema'
import { check } from 'meteor/check'

Meteor.methods({
  createGroup: function (group) {
    group.createdAt = new Date()
    group.createdBy = this.userId
    check(group, GroupSchema)
    return Groups.insert(group)
  },
  deleteGroup: function (groupId) {
    if (this.userId) {
      Groups.remove({'_id': groupId, 'createdBy': this.userId})
    } else {
      throw new Meteor.Error(401)
    }
  },
  addUserToGroup: function (groupId, userId) {
    if (this.userId) {
      Groups.update({'_id': groupId}, {$addToSet: {members: {userId: userId, addedBy: this.userId, addedOn: new Date()}}})
    }
  },
  removeUserFromGroup: function (groupId, userId) {
    if (this.userId) {
      Groups.update({'_id': groupId}, {$pull: {members: {userId: userId}}})
    }
  }
})
