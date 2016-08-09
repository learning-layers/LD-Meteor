import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Tests } from '../lib/collections'

Meteor.publish('testData', function () {
  if (this.userId && Roles.userIsInRole(this.userId, ['admin'])) {
    return Tests.find()
  } else {
    throw new Meteor.Error(401)
  }
})
