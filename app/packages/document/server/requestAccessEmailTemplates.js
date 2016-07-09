import { Meteor } from 'meteor/meteor'

export const RequestAccess = {
  emailTemplates: {
    from: Meteor.settings.private.email.from,
    siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),
    requestDocumentAccess: {
      subject: function (sender, documentTitle) {
        let userName = (sender.profile && sender.profile.name) ? sender.profile.name : undefined
        if (userName) {
          return `${userName} wants access to the document '${documentTitle}' on ` + RequestAccess.emailTemplates.siteName
        } else {
          return `Access request for document '${documentTitle}' on ` + RequestAccess.emailTemplates.siteName
        }
      },
      text: function (sender, receiver, url, message) {
        let userName = (sender.profile && sender.profile.name) ? sender.profile.name : 'the user'
        var greeting = (receiver.profile && receiver.profile.name) ? ('Hello ' + receiver.profile.name + ',') : 'Hello,'

        var messagePart1 = `${greeting}
To give ${userName} access to the document, simply click the link below and choose the correct access setting on the website.
${url}
Thanks.`
        var messagePart2 = ''
        if (message && message !== '') {
          messagePart2 = `

${userName} also attached a message for you:
"${message}"`
        }
        return messagePart1 + messagePart2
      }
    }
  }
}

RequestAccess.urls = {
  requestAccess: function (token) {
    return Meteor.absoluteUrl('request-document-access/' + token)
  }
}
