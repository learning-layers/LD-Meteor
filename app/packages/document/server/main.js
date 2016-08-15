import { Meteor } from 'meteor/meteor'
import { Documents, DocumentComments, DocumentAccess } from '../lib/collections'
import { Tags } from '../../tags/lib/collections'
import { Counts } from 'meteor/tmeasday:publish-counts'
import { Groups } from '../../groups/lib/collections'
import { EtherpadControllerInstance } from '../../etherpad/server/EtherpadController'
import _sortBy from 'lodash/sortBy'
import { check, Match } from 'meteor/check'
import { USERS_DEFAULT } from '../../user/server/userProjections'
import { DOCUMENTS_PREVIEW, DOCUMENTS_EDIT, DOCUMENTS_READ } from './documentProjections'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

let listSessionsOfAuthorSync = Meteor.wrapAsync(EtherpadControllerInstance.listSessionsOfAuthor.bind(EtherpadControllerInstance))
let removeSessionSync = Meteor.wrapAsync(EtherpadControllerInstance.removeSession.bind(EtherpadControllerInstance))

Meteor.publish('documentList', function () {
  if (this.userId) {
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
        Meteor.users.find({ '_id': { $in: userList } }, USERS_DEFAULT), // fetches all users that are owners of the documents
        // retrieve all documents where the user is either the owner or he has access via the documentAccessObject
        Documents.find({
          $or: [
            { 'createdBy': this.userId },
            { '_id': { $in: documentAccessDocumentIds } }
          ]
        }, DOCUMENTS_PREVIEW)
      ]
    })
  } else {
    throw new Meteor.Error(401)
  }
})

function stopDocumentPublisher (self, document) {
  // console.log('BEGIN document onStop')
  // (1) Get groupPadID of the document
  if (document) {
    let documentEtherpadGroup = document.etherpadGroup
    // (2) Get sessions of the user (author)
    let user = Meteor.users.findOne({'_id': self.userId})
    if (user && user.etherpadAuthorId) {
      // console.log('> document onStop: user.profile.name=' + user.profile.name)
      let authorSessions
      try {
        authorSessions = listSessionsOfAuthorSync(user.etherpadAuthorId)
      } catch (e) {
        console.error(JSON.stringify(e))
      }
      if (authorSessions) {
        // (3) Match session's groupIDs against the document's groupPadID group part
        let sessionsForThisDocumentsGroup = []
        let sessionIDs = Object.keys(authorSessions)
        sessionIDs.forEach(function (sessionID) {
          let sessionObj = authorSessions[sessionID]
          if (sessionObj.groupID === documentEtherpadGroup) {
            sessionObj.sessionID = sessionID
            sessionsForThisDocumentsGroup.push(sessionObj)
          }
        })
        let sortedSessions = _sortBy(sessionsForThisDocumentsGroup, function (sessionObj) {
          return sessionObj.validUntil
        })
        // (4) When matching delete older sessions first
        // (5) delete all but five
        //     (it is not likely that
        //      the user has more than five times opened a document
        //      accross all devices)
        let sortedSessionsLength = sortedSessions.length
        let currentItemCount = 0
        // console.log('> document onStop: sortedSessionsLength=' + sortedSessionsLength)
        try {
          sortedSessions.forEach(function (session) {
            if (sortedSessionsLength - currentItemCount > 5) {
              // console.log('> document onStop: deleted session=' + session.sessionID)
              removeSessionSync(session.sessionID)
              currentItemCount++
            }
          })
        } catch (e) {
          console.error(JSON.stringify(e))
        }
      }
    }
  }
  // console.log('END document onStop')
}

Meteor.publish('document', function (args) {
  check(args, Match.OneOf({
    id: String
  }, {
    id: String,
    action: String,
    permission: String,
    accessKey: String
  }))
  check(arguments, Match.Any)
  if (args.action === 'shared' && args.permission === 'CanView' && args.accessKey) {
    const documentAccessObj = DocumentAccess.findOne({ documentId: args.id, 'linkCanView.linkId': args.accessKey })
    if (documentAccessObj) {
      return [
        Documents.find({ '_id': args.id }, DOCUMENTS_READ),
        DocumentAccess.find({documentId: args.id})
      ]
    } else {
      throw new Meteor.Error(403)
    }
  } else if (this.userId) {
    let document
    this.onStop(() => {
      stopDocumentPublisher(this, document)
    })
    if (args.action === 'shared' && (args.permission === 'CanEdit' || args.permission === 'CanComment') && args.accessKey) {
      let filterObj = {documentId: args.id}
      filterObj['link' + args.permission + '.linkId'] = args.accessKey
      const docAccess = DocumentAccess.findOne(filterObj)
      if (docAccess) {
        return [
          Documents.find({ '_id': args.id }, DOCUMENTS_EDIT),
          DocumentAccess.find({documentId: args.id})
        ]
      } else {
        throw new Meteor.Error(403)
      }
    } else {
      document = Documents.findOne({ '_id': args.id })
      if (document && document.createdBy === this.userId) {
        return [
          Documents.find({ '_id': args.id }, DOCUMENTS_EDIT),
          DocumentAccess.find({documentId: args.id})
        ]
      } else if (!document) {
        // no document found for this id
        console.error('Did not find the document with id=', args.id)
        throw new Meteor.Error(404)
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
          return [
            // TODO filter write url when read only permissions
            Documents.find({ '_id': args.id }, DOCUMENTS_EDIT),
            DocumentAccess.find({documentId: args.id})
          ]
        } else {
          // the user doesn't have access
          throw new Meteor.Error(403)
        }
      }
    }
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('documentTags', function (args) {
  check(args, {
    documentId: String
  })
  // TODO check for viewSharingId
  // TODO check document access
  return Tags.find({ parentId: args.documentId, type: 'document' })
})

Meteor.publish('documentComments', function (args) {
  check(args, {
    documentId: String
  })
  if (this.userId) { // TODO check document access
    return DocumentComments.find({ documentId: args.documentId, parents: { $type: 10 } })
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('documentCommentsCount', function (args) {
  check(args, {
    documentId: String
  })
  if (this.userId) { // TODO check document access
    Counts.publish(this, 'documentCommentsCount', DocumentComments.find({ documentId: args.documentId }))
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('documentAccess', function (args) {
  check(args, {
    documentId: String
  })
  if (this.userId) { // TODO check document access
    return DocumentAccess.find({ documentId: args.documentId })
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('commentReplies', function (args) {
  check(args, {
    documentId: String,
    parent: [String]
  })
  if (this.userId) { // TODO check document access
    return DocumentComments.find({ documentId: args.documentId, parents: { $all: [ args.parent ] } })
  } else {
    throw new Meteor.Error(401)
  }
})

Meteor.publish('commentRepliesCount', function (args) {
  check(args, {
    documentId: String,
    parent: [String]
  })
  if (this.userId) { // TODO check document access
    Counts.publish(this, 'crc-' + args.parent.join(','), DocumentComments.find({
      documentId: args.documentId,
      parents: { $all: [ args.parent ] }
    }))
  } else {
    throw new Meteor.Error(401)
  }
})

const subscriptionNames = [
  'documentList',
  'document',
  'documentTags',
  'documentComments',
  'documentCommentsCount',
  'documentAccess',
  'commentReplies',
  'commentRepliesCount'
]

subscriptionNames.forEach(function (subscriptionName) {
  DDPRateLimiter.addRule({
    name: subscriptionName,
    type: 'subscription',
    connectionId () { return true }
  }, 5, 1000)
})
