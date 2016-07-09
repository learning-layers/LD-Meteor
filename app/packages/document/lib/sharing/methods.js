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
  requestAccessToDocument: function (documentId, message) {
    if (this.userId) {
      const requestAccessItem = RequestAccessItems.findOne({createdBy: this.userId, documentId: documentId})
      if (requestAccessItem) {
        throw new Meteor.Error(409, 'An access request has already been sent to the document owner.')
      } else {
        // create a request access item
        let token = uuid.v4()
        const document = Documents.findOne({'_id': documentId})
        if (document) {
          if (message && message !== '') {
            RequestAccessItems.insert({
              createdBy: this.userId,
              createdAt: new Date(),
              documentId: documentId,
              owner: document.createdBy,
              token: token,
              message: message,
              result: null
            })
          } else {
            RequestAccessItems.insert({
              createdBy: this.userId,
              createdAt: new Date(),
              documentId: documentId,
              owner: document.createdBy,
              token: token,
              result: null
            })
          }
          // send a notification to the creator that someone wants to access the document
          var sender = Meteor.users.findOne(this.userId)
          var receiver = Meteor.users.findOne(document.createdBy)
          let options = {
            to: 'martin@bachl.pro',
            from: RequestAccessEmailTemplates.emailTemplates.requestDocumentAccess.from
              ? RequestAccessEmailTemplates.emailTemplates.requestDocumentAccess.from(sender)
              : RequestAccessEmailTemplates.emailTemplates.from,
            subject: RequestAccessEmailTemplates.emailTemplates.requestDocumentAccess.subject(sender, document.title)
          }

          if (typeof RequestAccessEmailTemplates.emailTemplates.requestDocumentAccess.text === 'function') {
            options.text = RequestAccessEmailTemplates.emailTemplates.requestDocumentAccess.text(sender, receiver, RequestAccessEmailTemplates.urls.requestAccess(token), message)
          }

          Email.send(options)
        } else {
          throw new Meteor.Error(400, 'Document doesn\'t exist.')
        }
      }
    }
  },
  addDocumentUserAccessAfterRequest: function (documentId, userId, permission) {
    Meteor.call('addDocumentUserAccess', documentId, userId, permission, (err, res) => {
      if (err) {
        //
      }
      if (res) {
        console.log(res)
        RequestAccessItems.update({documentId: documentId, createdBy: userId}, {$set: {result: true}})
      }
    })
  }
})
