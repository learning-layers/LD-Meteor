import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Accounts } from 'meteor/accounts-base'
import { check } from 'meteor/check'
// import { UserRoles } from '../../../common/lib/roles'

Meteor.methods({
  getRoles: function (userId) {
    check(userId, String)
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
    check(userId, String)
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
  resendUserVerificationMail: function (userId, address) {
    check(userId, String)
    check(address, String)
    if (this.userId && Roles.userIsInRole(this.userId, 'super-admin', Roles.GLOBAL_GROUP)) {
      let user = Meteor.users.findOne({'_id': userId})
      if (user) {
        if (Meteor.isServer) {
          Accounts.sendVerificationEmail(userId, address)
        }
      }
    } else if (this.userId === userId) {
      if (Meteor.isServer) {
        Accounts.sendVerificationEmail(userId, address)
      }
    }
  },
  activateUserRole: function (userId, userRole) {
    check(userId, String)
    check(userRole, String)
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
    check(userId, String)
    check(userRole, String)
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
