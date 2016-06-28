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
  }
})
