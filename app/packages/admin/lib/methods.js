import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Accounts } from 'meteor/accounts-base'
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
    return []
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
    return []
  },
  resendUserVerificationMail: function (userId) {
    if (this.userId && Roles.userIsInRole(this.userId, 'super-admin', Roles.GLOBAL_GROUP)) {
      let user = Meteor.users.findOne({'_id': userId})
      if (user) {
        if (Meteor.isServer) {
          Accounts.sendVerificationEmail(userId)
        }
      }
    }
  },
  activateUserRole: function (userId, userRole) {
    if (this.userId && Roles.userIsInRole(this.userId, 'super-admin', Roles.GLOBAL_GROUP)) {
      let user = Meteor.users.findOne({'_id': userId})
      if (user) {
        switch (userRole) {
          case 'help-admin-group.help-admin':
            Roles.addUsersToRoles(user._id, 'help-admin', 'help-admin-group')
            break
          case 'log-admin-group.log-admin':
            Roles.addUsersToRoles(user._id, 'log-admin', 'log-admin-group')
            break
        }
      }
    }
  },
  deactivateUserRole: function (userId, userRole) {
    if (this.userId && Roles.userIsInRole(this.userId, 'super-admin', Roles.GLOBAL_GROUP)) {
      let user = Meteor.users.findOne({'_id': userId})
      if (user) {
        switch (userRole) {
          case 'help-admin-group.help-admin':
            Roles.removeUsersFromRoles(user._id, 'help-admin', 'help-admin-group')
            break
          case 'log-admin-group.log-admin':
            Roles.removeUsersFromRoles(user._id, 'log-admin', 'log-admin-group')
            break
        }
      }
    }
  }
})
