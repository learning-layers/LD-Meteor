import { Meteor } from 'meteor/meteor'

Meteor.publish('currentUserRegisteredEmails', function () {
  if (this.userId) {
    return Meteor.users.find({'_id': this.userId}, {
      fields: {
        'services': 0,
        'status': 0
      }
    })
  }
  return []
})
