import { Meteor } from 'meteor/meteor'

function greet (welcomeMsg) {
  return function (user, url) {
    var greeting = (user.profile && user.profile.name) ? ('Hello ' + user.profile.name + ',') : 'Hello,'
    return `${greeting}
${welcomeMsg}, simply click the link below.
${url}
Thanks.`
  }
}

export const RequestAccess = {
  emailTemplates: {
    from: Meteor.settings.private.email.from,
    siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),
    resetPassword: {
      subject: function (user) {
        return 'How to reset your password on ' + RequestAccess.emailTemplates.siteName
      },
      text: function (user, url) {
        var greeting = (user.profile && user.profile.name) ? ('Hello ' + user.profile.name + ',') : 'Hello,'
        return `${greeting}
To reset your password, simply click the link below.
${url}
Thanks.`
      }
    },
    verifyEmail: {
      subject: function (user) {
        return 'How to verify email address on ' + RequestAccess.emailTemplates.siteName
      },
      text: greet('To verify your account email')
    },
    enrollAccount: {
      subject: function (user) {
        return 'An account has been created for you on ' + RequestAccess.emailTemplates.siteName
      },
      text: greet('To start using the service')
    }
  }
}

RequestAccess.urls = {
  requestAccess: function (token) {
    return Meteor.absoluteUrl('/request-document-access/' + token)
  }
}
