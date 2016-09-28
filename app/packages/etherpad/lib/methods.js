import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { Documents, DocumentAccess, DocumentSelections } from '../../document/lib/collections'
import { rateLimit } from '../../../common/lib/rate-limit'

let createGroupSync, createGroupPadSync, createAuthorSync, createPadSessionSync, getReadOnlyPadIdSync, getHTMLContentSync, setHTMLSync
if (Meteor.isServer) {
  let { EtherpadControllerInstance } = require('../server/EtherpadController')
  createGroupSync = Meteor.wrapAsync(EtherpadControllerInstance.createGroup.bind(EtherpadControllerInstance))
  createGroupPadSync = Meteor.wrapAsync(EtherpadControllerInstance.createGroupPad.bind(EtherpadControllerInstance))
  createAuthorSync = Meteor.wrapAsync(EtherpadControllerInstance.createAuthor.bind(EtherpadControllerInstance))
  createPadSessionSync = Meteor.wrapAsync(EtherpadControllerInstance.createPadSession.bind(EtherpadControllerInstance))
  getHTMLContentSync = Meteor.wrapAsync(EtherpadControllerInstance.getHTMLContent.bind(EtherpadControllerInstance))
  getReadOnlyPadIdSync = Meteor.wrapAsync(EtherpadControllerInstance.getReadOnlyPadId.bind(EtherpadControllerInstance))
  setHTMLSync = Meteor.wrapAsync(EtherpadControllerInstance.setHTML.bind(EtherpadControllerInstance))
}

Meteor.methods({
  createEtherpadReadOnlyId: function (documentId) {
    check(documentId, String)
    if (this.userId && Meteor.isServer) {
      const document = Documents.findOne({ '_id': documentId }, { etherpadGroup: 1 })
      if (!document) {
        throw new Meteor.Error(404)
      } else {
        const etherpadReadOnlyId = getReadOnlyPadIdSync(document.etherpadGroupPad)
        Documents.update({ '_id': documentId }, { $set: { etherpadReadOnlyId: etherpadReadOnlyId } })
      }
    } else if (Meteor.isServer) {
      throw new Meteor.Error(401)
    }
  },
  createEtherpadGroupAndPad: function (documentId, initialContent) {
    check(documentId, String)
    check(initialContent, Match.Maybe(String))
    if (this.userId && Meteor.isServer) {
      const document = Documents.findOne({ '_id': documentId }, { etherpadGroup: 1 })
      if (!document) {
        throw new Meteor.Error(404)
      } else if (document.etherpadGroup || document.etherpadGroupPad) {
        throw new Meteor.Error(409)
      } else {
        const newGroupId = createGroupSync()
        Documents.update({ '_id': documentId }, { $set: { etherpadGroup: newGroupId } })
        const documentSelection = DocumentSelections.findOne({documentId: documentId})
        const newGroupPadId = createGroupPadSync(newGroupId, 'doc' + documentId)
        if (documentSelection) {
          console.log('documentSelection.htmlContent=', documentSelection.htmlContent)
          setHTMLSync(newGroupPadId, documentSelection.htmlContent)
        }
        Documents.update({ '_id': documentId }, { $set: { etherpadGroupPad: newGroupPadId } })
      }
    } else if (Meteor.isServer) {
      throw new Meteor.Error(401)
    }
  },
  getEtherpadSession: function (documentId) {
    check(documentId, String)
    if (this.userId && Meteor.isServer) {
      const document = Documents.findOne({ '_id': documentId }, { etherpadGroup: 1 })
      if (document) {
        let user = Meteor.user()
        let authorId = user.etherpadAuthorId
        if (!authorId) {
          authorId = createAuthorSync(this.userId, user.profile.name)
          Meteor.users.update({ '_id': this.userId }, { $set: { etherpadAuthorId: authorId } })
        }
        return {
          sessionId: createPadSessionSync(document.etherpadGroup, authorId, new Date().getTime() + (60 * 60 * 24)),
          domain: this.connection.httpHeaders.host
        }
      } else {
        throw new Meteor.Error(404)
      }
    } else if (Meteor.isServer) {
      throw new Meteor.Error(401)
    }
  },
  getEtherpadHtmlContent: function (documentId, viewSharingLinkId) {
    check(documentId, String)
    check(viewSharingLinkId, String)
    if (Meteor.isServer) {
      const document = Documents.findOne({ '_id': documentId }, { etherpadGroupPad: 1 })
      if (document) {
        const documentAccess = DocumentAccess.findOne({documentId: documentId}, { fields: { linkCanView: 1 } })
        if (documentAccess && documentAccess.linkCanView && documentAccess.linkCanView.linkId === viewSharingLinkId) {
          return getHTMLContentSync(document.etherpadGroupPad)
        } else {
          throw new Meteor.Error(401, 'Unauthorized')
        }
      } else {
        throw new Meteor.Error(404, 'Not found')
      }
    } else if (Meteor.isServer) {
      throw new Meteor.Error(401)
    }
  }
})

rateLimit({
  methods: [
    'createEtherpadReadOnlyId',
    'createEtherpadGroupAndPad',
    'getEtherpadSession',
    'getEtherpadHtmlContent'
  ],
  limit: 30,
  timeRange: 10000
})
