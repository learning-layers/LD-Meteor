import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'
import { check } from 'meteor/check'
import uuid from 'node-uuid'
import { Documents, DocumentAccess } from '../../lib/collections'
import { RequestAccessItems } from './collections'
import { getAccessLevel } from '../util'
import { rateLimit } from '../../../../common/lib/rate-limit'

let RequestAccessEmailTemplates
if (Meteor.isServer) {
  const { RequestAccess } = require('../../server/requestAccessEmailTemplates')
  RequestAccessEmailTemplates = RequestAccess
}

Meteor.methods({
  requestAccessToDocument: function (documentId, message) {
    check(documentId, String)
    check(message, String)
    if (this.userId) {
      const requestAccessItem = RequestAccessItems.findOne({createdBy: this.userId, documentId: documentId})
      if (requestAccessItem) {
        throw new Meteor.Error(409, 'An access request has already been sent to the document owner.')
      } else {
        // create a request access item
        let token = uuid.v4()
        const document = Documents.findOne({'_id': documentId}, { fields: { title: 1, createdBy: 1 } })
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
            to: Meteor.settings.private.initialUser.email,
            from: RequestAccessEmailTemplates.emailTemplates.requestDocumentAccess.from
              ? RequestAccessEmailTemplates.emailTemplates.requestDocumentAccess.from(sender)
              : RequestAccessEmailTemplates.emailTemplates.from,
            subject: RequestAccessEmailTemplates.emailTemplates.requestDocumentAccess.subject(sender, document.title)
          }

          if (typeof RequestAccessEmailTemplates.emailTemplates.requestDocumentAccess.text === 'function') {
            options.text = RequestAccessEmailTemplates.emailTemplates.requestDocumentAccess.text(sender, receiver, RequestAccessEmailTemplates.urls.requestAccess(token), message)
          }

          Email.send(options)
          return true
        } else {
          throw new Meteor.Error(404, 'Document doesn\'t exist.')
        }
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  addDocumentUserAccessAfterRequest: function (documentId, userId, permission) {
    check(documentId, String)
    check(userId, String)
    check(permission, String)
    if (this.userId) {
      Meteor.call('addDocumentUserAccess', documentId, userId, permission, (err, res) => {
        if (err) {
          //
        }
        if (res) {
          RequestAccessItems.update({ documentId: documentId, createdBy: userId, owner: this.userId }, { $set: { result: true } })
        }
      })
    } else {
      throw new Meteor.Error(401)
    }
  },
  rejectDocumentUserAccessAfterRequest: function (token) {
    check(token, String)
    if (this.userId) {
      const requestAccessItem = RequestAccessItems.findOne({ token: token, owner: this.userId })
      Meteor.call('removeDocumentUserAccess', requestAccessItem.documentId, requestAccessItem.createdBy, (err, res) => {
        if (err) {
          RequestAccessItems.update({ token: token, owner: this.userId }, { $set: { result: false } })
        }
        if (res) {
          RequestAccessItems.update({ token: token, owner: this.userId }, { $set: { result: false } })
        }
      })
    } else {
      throw new Meteor.Error(401, 'Unauthorized')
    }
  },
  generateDocumentSharingLink: function (documentId, permission) {
    check(documentId, String)
    check(permission, String)
    if (this.userId) {
      const document = Documents.findOne({'_id': documentId}, { fields: { _id: 1 } })
      if (document) {
        const userAccessLevel = getAccessLevel(documentId, this.userId)
        if (userAccessLevel && userAccessLevel === 'edit') {
          let setObject = {}
          let linkId = uuid.v4()
          setObject['link' + permission] = {
            linkId: linkId,
            addedBy: this.userId,
            addedOn: new Date() // TODO add expiresOn
          }

          const docAccess = DocumentAccess.findOne({documentId: documentId})
          let docAccessId
          if (docAccess) {
            docAccessId = docAccess._id
          }
          if (!docAccessId) {
            DocumentAccess.insert({
              documentId: documentId,
              userCanView: [],
              userCanComment: [],
              userCanEdit: [],
              groupCanView: [],
              groupCanComment: [],
              groupCanEdit: []
            })
          }

          // TODO add give yourself a name option
          DocumentAccess.update({ 'documentId': documentId }, {
            $set: setObject
          })
        } else {
          throw new Meteor.Error(403, 'Not enough access rights to generate a sharing link')
        }
      } else {
        throw new Meteor.Error(404, 'Document doesn\'t exist.')
      }
    } else {
      throw new Meteor.Error(401, 'Unauthorized')
    }
  },
  removeDocumentSharingLink: function (documentId, permission) {
    check(documentId, String)
    check(permission, String)
    if (this.userId) {
      // TODO check if the user is the owner
      const document = Documents.findOne({'_id': documentId}, { fields: { _id: 1 } })
      if (document) {
        const userAccessLevel = getAccessLevel(documentId, this.userId)
        if (userAccessLevel && userAccessLevel === 'edit') {
          let unsetObject = {}
          unsetObject['link' + permission] = 1
          console.log(unsetObject)
          const updated = DocumentAccess.update({documentId: document._id}, {$unset: unsetObject})
          if (updated) {
            return true
          } else {
            return false
          }
        } else {
          throw new Meteor.Error(403, 'Not enough access rights to remove a sharing link')
        }
      }
    }
  },
  assignDocumentEditOrCommentPermissions: function (documentId, permission, accessKey) {
    check(documentId, String)
    check(permission, String)
    check(accessKey, String)
    if (this.userId) {
      const document = Documents.findOne({'_id': documentId}, { fields: { _id: 1 } })
      if (document) {
        const userAccessLevel = getAccessLevel(documentId, this.userId)
        if (userAccessLevel && userAccessLevel === 'edit') {
          let filterObj = {documentId: documentId}
          filterObj['link' + permission + '.linkId'] = accessKey
          const docAccess = DocumentAccess.findOne(filterObj)
          if (docAccess) {
            let addToSetObject = {}
            addToSetObject['user' + permission] = {
              userId: this.userId,
              addedBy: this.userId,
              addedOn: new Date()
            }
            let updateId = DocumentAccess.update({ '_id': docAccess._id }, {
              $addToSet: addToSetObject
            })
            if (updateId) {
              return true
            } else {
              return new Meteor.Error(500)
            }
          } else {
            return false
          }
        } else {
          throw new Meteor.Error(403, 'Not enough access rights to assign permissions')
        }
      }
    } else {
      throw new Meteor.Error(401, 'Unauthorized')
    }
  }
})

rateLimit({
  methods: [
    'requestAccessToDocument',
    'addDocumentUserAccessAfterRequest',
    'rejectDocumentUserAccessAfterRequest',
    'generateDocumentSharingLink',
    'removeDocumentSharingLink',
    'assignDocumentEditOrCommentPermissions'
  ],
  limit: 20,
  timeRange: 10000
})
