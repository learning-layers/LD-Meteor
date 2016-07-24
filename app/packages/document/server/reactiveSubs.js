import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Documents, DocumentAccess } from '../lib/collections'
import { Groups } from '../../groups/lib/collections'
import { ServerArgs } from '../../serverargs/lib/collections'

let getDocumentPublishersForUser = function (args) {
  // find all groups the user is a member in
  let groups = Groups.find({'members.userId': this.userId}, {name: 0, members: 0}).fetch()

  // collect all groupIds
  let groupIds = []
  groups.forEach(function (group) {
    groupIds.push(group._id)
  })

  // look for all documents the user or groups the user is a member of has access to via a documentAccessObject
  const documentAccessObjects = DocumentAccess.find(
    {
      $or: [
        { 'userCanView.userId': this.userId },
        { 'userCanComment.userId': this.userId },
        { 'userCanEdit.userId': this.userId },
        { 'groupCanView.groupId': {$in: groupIds} },
        { 'groupCanComment.groupId': {$in: groupIds} },
        { 'groupCanEdit.groupId': {$in: groupIds} }
      ]
    },
    { userCanView: 0, userCanEdit: 0, userCanComment: 0, groupCanView: 0, groupCanEdit: 0, groupCanComment: 0 }
  ).fetch()

  // collect all documentIds that the user has access to
  let documentAccessDocumentIds = []
  documentAccessObjects.forEach(function (documentAccessDocumentObject) {
    documentAccessDocumentIds.push(documentAccessDocumentObject.documentId)
  })

  // retrieve all documents where the user is either the owner or
  // he has access via the documentAccessObject
  const documents = Documents.find({ $or: [ { createdBy: this.userId }, { '_id': { $in: documentAccessDocumentIds } } ] }, { sort: {createdBy: -1}, limit: args.limit, createdBy: 1 }).fetch()

  let userList = []
  documents.forEach(function (document) {
    userList.push(document.createdBy)
  })
  return [
    Meteor.users.find({ '_id': { $in: userList } }), // fetches all users that are owners of the documents
    // retrieve all documents where the user is either the owner or he has access via the documentAccessObject
    Documents.find({ $or: [ { 'createdBy': this.userId }, { '_id': { $in: documentAccessDocumentIds } } ] })
  ]
}

Meteor.publish('reactiveDocumentList', function (initialArgs) {
  check(initialArgs, {
    limit: Number
  })
  let itemId = 'reactiveDocumentList'
  if (this.userId) {
    ServerArgs.upsert({'itemId': itemId, createdBy: this.userId}, {'itemId': itemId, createdBy: this.userId, args: initialArgs})
    this.autorun(function () {
      let serverArgs = ServerArgs.findOne({'itemId': itemId, createdBy: this.userId})
      if (serverArgs) {
        // use server args
        return getDocumentPublishersForUser.call(this, {limit: serverArgs.args.limit})
      } else {
        // use initial args, server args not yet accessible
        return getDocumentPublishersForUser.call(this, {limit: initialArgs.limit})
      }
    })
    this.onStop(() => {
      ServerArgs.remove({'itemId': itemId, createdBy: this.userId})
    })
  }
})
