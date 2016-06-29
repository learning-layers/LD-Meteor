import { Meteor } from 'meteor/meteor'
import { Documents, DocumentComments, DocumentAccess } from '../lib/collections'
import { Tags } from '../../tags/lib/collections'
import { Counts } from 'meteor/tmeasday:publish-counts'

Meteor.publish('documentList', function () {
  this.autorun(function () {
    // look for all documents the user has access to via
    // a documentAccessObject
    const documentAccessObjects = DocumentAccess.find(
      { $or: [ { 'userCanView.userId': this.userId }, { 'userCanComment.userId': this.userId }, { 'userCanEdit.userId': this.userId } ] },
      { userCanView: 0, userCanEdit: 0, userCanComment: 0, groupCanView: 0, groupCanEdit: 0, groupCanComment: 0 }
    ).fetch()

    // TODO add group sharings

    // collect all documentIds that the user has access to
    let documentAccessDocumentIds = []
    documentAccessObjects.forEach(function (documentAccessDocumentObject) {
      documentAccessDocumentIds.push(documentAccessDocumentObject.documentId)
    })

    // retrieve all documents where the user is either the owner or
    // he has access via the documentAccessObject
    const documents = Documents.find({ $or: [ { createdBy: this.userId }, { '_id': { $in: documentAccessDocumentIds } } ] }, { createdBy: 1 }).fetch()

    let userList = []
    documents.forEach(function (document) {
      userList.push(document.createdBy)
    })
    return [
      Meteor.users.find({ '_id': { $in: userList } }), // fetches all users that are owners of the documents
      // retrieve all documents where the user is either the owner or he has access via the documentAccessObject
      Documents.find({ $or: [ { 'createdBy': this.userId }, { '_id': { $in: documentAccessDocumentIds } } ] })
    ]
  })
})

Meteor.publish('document', function (args) {
  return Documents.find({ '_id': args.id })
})

Meteor.publish('documentTags', function (args) {
  return Tags.find({ parentId: args.documentId, type: 'document' })
})

Meteor.publish('documentComments', function (args) {
  return DocumentComments.find({ documentId: args.documentId, parents: { $type: 10 } })
})

Meteor.publish('documentCommentsCount', function (args) {
  Counts.publish(this, 'documentCommentsCount', DocumentComments.find({ documentId: args.documentId }))
})

Meteor.publish('documentAccess', function (args) {
  return DocumentAccess.find({ documentId: args.documentId })
})

Meteor.publish('commentReplies', function (args) {
  return DocumentComments.find({ documentId: args.documentId, parents: { $all: [ args.parent ] } })
})

Meteor.publish('commentRepliesCount', function (args) {
  Counts.publish(this, 'crc-' + args.parent.join(','), DocumentComments.find({
    documentId: args.documentId,
    parents: { $all: [ args.parent ] }
  }))
})
