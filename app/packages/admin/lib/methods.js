import { Meteor } from 'meteor/meteor'
// import { UserRoles } from '../../../common/lib/roles'

Meteor.methods({
  getRoles: function (userId) {
    if (this.userId) {
      let user = Meteor.users.findOne({'_id': userId})
      if (user) {
        return user.roles
      } else {
        return []
      }
    }
    return false
  },
  getRegisteredEmails: function (userId) {
    if (this.userId) {
      let user = Meteor.users.findOne({'_id': userId})
      if (user) {
        return user.registered_emails
      } else {
        return []
      }
    }
    return false
  }
})
