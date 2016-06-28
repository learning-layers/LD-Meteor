import { Meteor } from 'meteor/meteor'
import { Groups } from '../lib/collections'

Meteor.publish('groupList', function () {
  return Groups.find({'createdBy': this.userId})
})
