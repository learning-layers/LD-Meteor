import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Accounts } from 'meteor/accounts-base'
import { check } from 'meteor/check'
// import { UserRoles } from '../../../common/lib/roles'
import { rateLimit } from '../../../common/lib/rate-limit'
import { SimpleRest } from 'meteor/simple:rest'

let options = {
  url: 'create-user-via-api',
  httpMethod: 'post',
  getArgsFromRequest: function (request) {
    let content = request.body
    return [
      content.apiKey,
      content.username,
      content.email/* , content.profile */
    ]
  }
}

if (Meteor.isServer) {
  SimpleRest.setMethodOptions('createUserViaAPI', options)
}

Meteor.methods({
  createUserViaAPI: (apiKey, username, email, profile) => {
    check(email, String)
    if (Meteor.settings.private.apiKey === apiKey) {
      const newUserId = Accounts.createUser({
        username,
        email,
        password: 'initial' // ,
        // profile: {name: 'TestName'}
      })
      return newUserId
    }
  },
  getRoles: function (userId) {
    check(userId, String)
    if (this.userId && Roles.userIsInRole(this.userId, 'super-admin', Roles.GLOBAL_GROUP)) {
      let user = Meteor.users.findOne({'_id': userId}, { fields: { roles: 1 } })
      if (user) {
        return user.roles
      } else {
        return []
      }
    } else if (this.userId && this.userId === userId) {
      let user = Meteor.users.findOne({'_id': this.userId}, { fields: { roles: 1 } })
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
    if (this.userId && Roles.userIsInRole(this.userId, 'super-admin', Roles.GLOBAL_GROUP)) {
      let user = Meteor.users.findOne({'_id': userId}, { fields: { registered_emails: 1 } })
      if (user) {
        return user.registered_emails
      } else {
        return []
      }
    } else if (this.userId && this.userId === userId) {
      let user = Meteor.users.findOne({'_id': this.userId}, { fields: { registered_emails: 1 } })
      if (user) {
        return user.registered_emails
      } else {
        return []
      }
    } else {
      throw new Meteor.Error(401)
    }
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

rateLimit({
  methods: [
    'getRoles',
    'getRegisteredEmails',
    'resendUserVerificationMail',
    'activateUserRole',
    'deactivateUserRole',
    'createUserViaAPI'
  ],
  limit: 10,
  timeRange: 10000
})
