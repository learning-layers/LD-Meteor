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
      // check if user is in group first
      const group = Groups.find({'_id': userId})
      let found = false
      if (group.members) {
        group.members.forEach(function (member) {
          if (member.userId === userId) {
            found = true
          }
        })
      }
      if (!found) {
        Groups.update({ '_id': groupId }, {
          $addToSet: {
            members: {
              userId: userId,
              addedBy: this.userId,
              addedOn: new Date()
            }
          }
        })
      } else {
        throw new Meteor.Error(400, 'User already member of the group')
      }
    }
  },
  removeUserFromGroup: function (groupId, userId) {
    if (this.userId) {
      Groups.update({'_id': groupId}, {$pull: {members: {userId: userId}}})
    }
  }
})