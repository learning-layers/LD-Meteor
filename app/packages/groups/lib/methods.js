import { Meteor } from 'meteor/meteor'
import { Groups } from './collections'
import { GroupSchema } from './schema'
import { check } from 'meteor/check'
import { isMemberInGroup } from './util'

Meteor.methods({
  createGroup: function (group) {
    group.createdAt = new Date()
    group.createdBy = this.userId
    check(group, GroupSchema)
    if (this.userId) {
      return Groups.insert(group)
    } else {
      throw new Meteor.Error(401)
    }
  },
  deleteGroup: function (groupId) {
    check(groupId, String)
    if (this.userId) {
      Groups.remove({'_id': groupId, 'createdBy': this.userId})
    } else {
      throw new Meteor.Error(401)
    }
  },
  leaveGroup: function (groupId) {
    check(groupId, String)
    if (this.userId) {
      Groups.update({'_id': groupId}, {$set: {modifiedAt: new Date()}, $pull: {members: {userId: this.userId}}})
    } else {
      throw new Meteor.Error(401)
    }
  },
  addUserToGroup: function (groupId, userId) {
    check(groupId, String)
    check(userId, String)
    if (this.userId) {
      const group = Groups.find({'_id': groupId}, { fields: { members: 1, createdBy: 1 } })
      if (isMemberInGroup(group)) {
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
            $set: {modifiedAt: new Date()},
            $addToSet: {
              members: {
                userId: userId,
                addedBy: this.userId,
                addedOn: new Date()
              }
            }
          })
        } else {
          throw new Meteor.Error(403, 'You are not a member of this group and hence don\'t have access rights')
        }
      } else {
        throw new Meteor.Error(400, 'User already member of the group')
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  removeUserFromGroup: function (groupId, userId) {
    check(groupId, String)
    check(userId, String)
    if (this.userId) { // TODO check that the user has access to the Group
      const group = Groups.find({'_id': groupId}, { fields: { members: 1, createdBy: 1 } })
      if (isMemberInGroup(group)) {
        Groups.update({'_id': groupId}, {$set: {modifiedAt: new Date()}, $pull: {members: {userId: userId}}})
      } else {
        throw new Meteor.Error(403, 'You are not a member of this group and hence don\'t have access rights')
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  getGroupMentions: function (args) {
    check(args, {
      mentionSearch: String
    })
    if (this.userId && args.mentionSearch.length >= 4) {
      return Groups.find({ name: { $regex: '^' + args.mentionSearch, $options: 'i' } }).fetch()
    } else if (this.userId) {
      return []
    } else {
      throw new Meteor.Error(401)
    }
  }
})
