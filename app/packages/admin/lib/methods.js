import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Accounts } from 'meteor/accounts-base'
import { check } from 'meteor/check'
// import { UserRoles } from '../../../common/lib/roles'

Meteor.methods({
  getRoles: function (userId) {
    check(userId, String)
    if (this.userId) { // TODO check for whom this should be available
      let user = Meteor.users.findOne({'_id': userId}, { fields: { roles: 1 } })
      if (user) {
        return user.roles
      } else {
        return []
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  getRegisteredEmails: function (userId) {
    check(userId, String)
    if (this.userId) { // TODO check for whom this should be available
      let user = Meteor.users.findOne({'_id': userId}, { fields: { registered_emails: 1 } })
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
      let user = Meteor.users.findOne({'_id': userId}, { fields: { _id: 1 } })
      if (user) {
        if (Meteor.isServer) {
          Accounts.sendVerificationEmail(userId, address)
        }
      }
    } else if (this.userId === userId) {
      if (Meteor.isServer) {
        Accounts.sendVerificationEmail(userId, address)
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  activateUserRole: function (userId, userRole) {
    check(userId, String)
    check(userRole, String)
    if (this.userId && Roles.userIsInRole(this.userId, 'super-admin', Roles.GLOBAL_GROUP)) {
      let user = Meteor.users.findOne({'_id': userId}, { fields: { _id: 1 } })
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
    } else {
      throw new Meteor.Error(401)
    }
  },
  deactivateUserRole: function (userId, userRole) {
    check(userId, String)
    check(userRole, String)
    if (this.userId && Roles.userIsInRole(this.userId, 'super-admin', Roles.GLOBAL_GROUP)) {
      let user = Meteor.users.findOne({'_id': userId}, { fields: { _id: 1 } })
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
    } else {
      throw new Meteor.Error(401)
    }
  }
})
