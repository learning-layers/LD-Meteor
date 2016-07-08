import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'
import uuid from 'node-uuid'
import { Documents } from '../../lib/collections'
import { RequestAccessItems } from './collections'

let RequestAccessEmailTemplates
if (Meteor.isServer) {
  const { RequestAccess } = require('../../server/requestAccessEmailTemplates')
  RequestAccessEmailTemplates = RequestAccess
}

Meteor.methods({
  requestAccessToDocument: function (documentId) {
    if (this.userId) {
      const requestAccessItem = RequestAccessItems.findOne({createdBy: this.userId, documentId: documentId})
      if (requestAccessItem) {
        throw new Meteor.Error(409, 'An access request has already been sent to the document owner.')
      } else {
        // create a request access item
        let token = uuid.v4()
        const document = Documents.findOne({'_id': documentId})
        RequestAccessItems.insert({createdBy: this.userId, documentId: documentId, owner: document.createdBy, token: token})
        // send a notification to the creator that someone wants to access the document
        var user = Meteor.users.findOne(this.userId)
        let options = {
          to: 'martin@bachl.pro',
          from: RequestAccessEmailTemplates.emailTemplates.resetPassword.from
            ? RequestAccessEmailTemplates.emailTemplates.resetPassword.from(user)
            : RequestAccessEmailTemplates.emailTemplates.from,
          subject: RequestAccessEmailTemplates.emailTemplates.resetPassword.subject(user)
        }

        if (typeof RequestAccessEmailTemplates.emailTemplates.resetPassword.text === 'function') {
          options.text = RequestAccessEmailTemplates.emailTemplates.resetPassword.text(user, RequestAccessEmailTemplates.urls.requestAccess(token))
        }

        Email.send(options)
      }
    }
  }
})
