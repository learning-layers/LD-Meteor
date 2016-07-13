import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Documents } from '../../document/lib/collections'

let createGroupSync, createGroupPadSync, createAuthorSync, createPadSessionSync, getHTMLContentSync
if (Meteor.isServer) {
  let { EtherpadControllerInstance } = require('../server/EtherpadController')
  createGroupSync = Meteor.wrapAsync(EtherpadControllerInstance.createGroup.bind(EtherpadControllerInstance))
  createGroupPadSync = Meteor.wrapAsync(EtherpadControllerInstance.createGroupPad.bind(EtherpadControllerInstance))
  createAuthorSync = Meteor.wrapAsync(EtherpadControllerInstance.createAuthor.bind(EtherpadControllerInstance))
  createPadSessionSync = Meteor.wrapAsync(EtherpadControllerInstance.createPadSession.bind(EtherpadControllerInstance))
  getHTMLContentSync = Meteor.wrapAsync(EtherpadControllerInstance.getHTMLContent.bind(EtherpadControllerInstance))
}

Meteor.methods({
  createEtherpadGroupAndPad: function (documentId) {
    if (this.userId) {
      check(documentId, String)
      if (Meteor.isServer) {
        const document = Documents.findOne({ '_id': documentId }, { etherpadGroup: 1 })
        if (!document) {
          throw new Meteor.Error(404)
        } else if (document.etherpadGroup || document.etherpadGroupPad) {
          throw new Meteor.Error(409)
        } else {
          const newGroupId = createGroupSync()
          Documents.update({ '_id': documentId }, { $set: { etherpadGroup: newGroupId } })
          const newGroupPadId = createGroupPadSync(newGroupId, 'doc' + documentId)
          Documents.update({ '_id': documentId }, { $set: { etherpadGroupPad: newGroupPadId } })
        }
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  getEtherpadSession: function (documentId) {
    if (this.userId) {
      if (Meteor.isServer) {
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
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  getEtherpadHtmlContent: function (documentId, viewSharingLinkId) {
    if (this.userId) {
      if (Meteor.isServer) {
        const document = Documents.findOne({ '_id': documentId }, { etherpadGroup: 1 })
        if (document) {
          // TODO check if the view sharing link id is valid
          return getHTMLContentSync(document._id, viewSharingLinkId)
        } else {
          throw new Meteor.Error(404)
        }
      }
    } else {
      throw new Meteor.Error(401)
    }
  }
})
