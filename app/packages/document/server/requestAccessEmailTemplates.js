import { Meteor } from 'meteor/meteor'

/* function greet (welcomeMsg) {
  return function (user, url) {
    var greeting = (user.profile && user.profile.name) ? ('Hello ' + user.profile.name + ',') : 'Hello,'
    return `${greeting}
${welcomeMsg}, simply click the link below.
${url}
Thanks.`
  }
}*/

export const RequestAccess = {
  emailTemplates: {
    from: Meteor.settings.private.email.from,
    siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),
    requestDocumentAccess: {
      subject: function (user) {
        return 'Someone wants access to the document "placeholder" on ' + RequestAccess.emailTemplates.siteName
      },
      text: function (user, url) {
        var greeting = (user.profile && user.profile.name) ? ('Hello ' + user.profile.name + ',') : 'Hello,'
        return `${greeting}
To give the user access to the document, simply click the link below and choose the correct access setting on the website.
${url}
Thanks.`
      }
    }
  }
}

RequestAccess.urls = {
  requestAccess: function (token) {
    return Meteor.absoluteUrl('request-document-access/' + token)
  }
}
