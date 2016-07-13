import { Meteor } from 'meteor/meteor'
import { Documents, DocumentComments, DocumentAccess } from '../lib/collections'
import { Tags } from '../../tags/lib/collections'
import { Counts } from 'meteor/tmeasday:publish-counts'
import { Groups } from '../../groups/lib/collections'

Meteor.publish('documentList', function () {
  this.autorun(function () {
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
  if (this.userId) {
    let document = Documents.findOne({ '_id': args.id, createdBy: this.userId })
    if (document) {
      return Documents.find({ '_id': args.id })
    } else {
      // the user is not the creator of this document hence there has to be a more extensive
      // search if the user has access or not
      // find all groups the user is a member in
      let groups = Groups.find({ 'members.userId': this.userId }, { name: 0, members: 0 }).fetch()

      // collect all groupIds
      let groupIds = []
      groups.forEach(function (group) {
        groupIds.push(group._id)
      })
      const documentAccessObj = DocumentAccess.findOne(
        {
          $and: [
            { documentId: args.id },
            {
              $or: [
                { 'userCanView.userId': this.userId },
                { 'userCanComment.userId': this.userId },
                { 'userCanEdit.userId': this.userId },
                { 'groupCanView.groupId': { $in: groupIds } },
                { 'groupCanComment.groupId': { $in: groupIds } },
                { 'groupCanEdit.groupId': { $in: groupIds } }
              ]
            }
          ]
        }
      )
      if (documentAccessObj) {
        return Documents.find({ '_id': args.id })
      } else {
        // the user doesn't have access
        throw new Meteor.Error(403)
      }
    }
  } else if (args.action && args.action === 'shared' && args.permission && args.accessKey) {
    console.log('permission=', args.permission, ' accessKey=', args.accessKey)
    return []
  } else {
    throw new Meteor.Error(401)
  }
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
