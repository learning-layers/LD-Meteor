import { Meteor } from 'meteor/meteor'

export const CommentMentioning = {
  emailTemplates: {
    from: Meteor.settings.private.email.from,
    siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),
    requestDocumentAccess: {
      subject: function (sender, documentTitle) {
        let userName = (sender.profile && sender.profile.name) ? sender.profile.name : undefined
        if (userName) {
          return `${userName} wrote a comment in '${documentTitle}' on ${CommentMentioning.emailTemplates.siteName} mentioning your name`
        } else {
          return `Someone wrote a comment in '${documentTitle}' on ${CommentMentioning.emailTemplates.siteName} mentioning your name`
        }
      },
      text: function (sender, receiver, url, message, documentTitle) {
        let userName = (sender.profile && sender.profile.name) ? sender.profile.name : 'the user'
        var greeting = (receiver.profile && receiver.profile.name) ? ('Hello ' + receiver.profile.name + ',') : 'Hello,'

        var messagePart1 = `${greeting}
${userName} has commented on the document '${documentTitle}', simply click the link below to navigate to the document.
${url}
Thanks.

${userName}'s comment:
"${message}"`
        return messagePart1
      }
    }
  }
}

CommentMentioning.urls = {
  commentMentioning: function (documentId) {
    return Meteor.absoluteUrl('document/' + documentId)
  }
}
