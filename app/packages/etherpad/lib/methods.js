import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Documents } from '../../document/lib/collections'

let createGroupSync, createGroupPadSync //, createAuthorSync, createPadSessionSync
if (Meteor.isServer) {
  let { EtherpadControllerInstance } = require('../server/EtherpadController')
  createGroupSync = Meteor.wrapAsync(EtherpadControllerInstance.createGroup.bind(EtherpadControllerInstance))
  createGroupPadSync = Meteor.wrapAsync(EtherpadControllerInstance.createGroupPad.bind(EtherpadControllerInstance))
  // createAuthorSync = Meteor.wrapAsync(EtherpadControllerInstance.createAuthor.bind(EtherpadControllerInstance))
  // createPadSessionSync = Meteor.wrapAsync(EtherpadControllerInstance.createPadSession.bind(EtherpadControllerInstance))
}

Meteor.methods({
  createEtherpadGroupAndPad: function (documentId) {
    check(documentId, String)
    if (Meteor.isServer) {
      const document = Documents.findOne({'_id': documentId}, {etherpadGroup: 1})
      if (!document) {
        throw new Meteor.Error(404)
      } else if (document.etherpadGroup || document.etherpadGroupPad) {
        throw new Meteor.Error(409)
      } else {
        const newGroupId = createGroupSync()
        Documents.update({'_id': documentId}, {$set: {etherpadGroup: newGroupId}})
        const newGroupPadId = createGroupPadSync(newGroupId, 'doc' + documentId)
        Documents.update({'_id': documentId}, {$set: {etherpadGroupPad: newGroupPadId}})
      }
    }
  }
})
