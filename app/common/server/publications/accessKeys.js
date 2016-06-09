import { Meteor } from 'meteor/meteor'

Meteor.publish('accessKeys', function (args) {
  if (this.userId) {
    // TODO redirect to the original document if user has access anyway
    // TODO else proceed as if the user is not logged in
  }
  return []
})
