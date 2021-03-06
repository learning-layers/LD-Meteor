import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { Email } from 'meteor/email'
import { Tags } from '../../tags/lib/collections'
import { DocumentComments, DocumentAccess } from '../lib/collections'
import { Groups } from '../../groups/lib/collections'
import { getAccessLevel } from './util'
import { rateLimit } from '../../../common/lib/rate-limit'
import { DocumentSchema, DocumentCommentSchema, DocumentSelectionSchema } from './schema'
import { Documents, DocumentSelections } from './collections'
import { RequestAccessItems } from './sharing/collections'

let CommentMentioningEmailTemplates
if (Meteor.isServer) {
  const { CommentMentioning } = require('../server/commentMentioningEmailTemplates')
  CommentMentioningEmailTemplates = CommentMentioning
}

function sendMentioningEmail (documentId, documentTitle, commentText, senderId, receiverId) {
  var sender = null
  var receiver = null
  try {
    sender = Meteor.users.findOne(senderId)
    receiver = Meteor.users.findOne(receiverId)
    let email = receiver.profile.email
    let foundVerifiedEmail = false
    if (receiver) {
      receiver.registered_emails.forEach(function (registeredEmail) {
        if (registeredEmail.verified) {
          if (!email) {
            email = registeredEmail.address
            foundVerifiedEmail = true
          }
        } else if (!foundVerifiedEmail) {
          email = registeredEmail.address
        }
      })
      if (!email && receiver.emails) {
        receiver.emails.forEach(function (profileEmail) {
          if (profileEmail.verified) {
            email = profileEmail.address
            foundVerifiedEmail = true
          } else {
            if (!foundVerifiedEmail) {
              email = profileEmail.address
            }
          }
        })
      }
    }
    let options = {
      to: email,
      from: CommentMentioningEmailTemplates.emailTemplates.requestDocumentAccess.from
        ? CommentMentioningEmailTemplates.emailTemplates.requestDocumentAccess.from(sender)
        : CommentMentioningEmailTemplates.emailTemplates.from,
      subject: CommentMentioningEmailTemplates.emailTemplates.requestDocumentAccess.subject(sender, documentTitle)
    }

    if (typeof CommentMentioningEmailTemplates.emailTemplates.requestDocumentAccess.text === 'function') {
      options.text = CommentMentioningEmailTemplates.emailTemplates.requestDocumentAccess.text(
        sender,
        receiver,
        CommentMentioningEmailTemplates.urls.commentMentioning(documentId),
        commentText,
        documentTitle
      )
    }

    Email.send(options)
  } catch (e) {
    try {
      global.log.error('couldn\'t send comment mentioning to recipient', {
        sender: JSON.stringify(sender),
        receiver: JSON.stringify(receiver),
        commentText: commentText,
        senderId: senderId,
        receiverId: receiverId,
        documentId: documentId
      })
    } catch (e2) {
      global.log.error('couldn\'t send comment mentioning to recipient', {
        commentText: commentText,
        senderId: senderId,
        receiverId: receiverId,
        documentId: documentId
      })
    }
  }
}

Meteor.methods({
  changeDocumentTitle (documentId, documentTitle) {
    check(documentId, String)
    check(documentTitle, String)
    if (this.userId) {
      const userAccessLevel = getAccessLevel(documentId, this.userId)
      if (userAccessLevel && userAccessLevel === 'edit') {
        Documents.update({'_id': documentId}, {$set: {title: documentTitle}})
        return true
      } else {
        throw new Meteor.Error(403, 'Not enough access rights to change the document title')
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  createDocument (document) {
    document.createdAt = new Date()
    document.createdBy = this.userId
    check(document, DocumentSchema)
    if (this.userId) {
      return Documents.insert(document)
    } else {
      throw new Meteor.Error(401)
    }
  },
  createSubDocument (document, selection, parentId, sharedWithSameUsers) {
    check(parentId, String)
    check(sharedWithSameUsers, Boolean)
    selection.parentId = selection.documentId
    delete selection.documentId
    selection.createdBy = this.userId
    check(selection, DocumentSelectionSchema)
    document.createdAt = new Date()
    document.createdBy = this.userId
    document.isSubDocument = true
    check(document, DocumentSchema)
    if (this.userId) {
      let newDocumentId = Documents.insert(document)
      selection.documentId = newDocumentId
      let documentSelectionId
      try {
        documentSelectionId = DocumentSelections.insert(selection)
        if (sharedWithSameUsers) {
          let documentAccess = DocumentAccess.findOne({ documentId: parentId })
          if (documentAccess) {
            delete documentAccess._id
            documentAccess.documentId = newDocumentId
            DocumentAccess.insert(documentAccess)
          }
        }
        return newDocumentId
      } catch (e) {
        // cleanup if previous actions failed
        Documents.remove(newDocumentId)
        if (documentSelectionId) {
          DocumentSelections.remove(documentSelectionId)
        }
        throw e
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  addTagToDocument (tagLabel, tagValue, documentId) {
    check(tagLabel, String)
    check(tagValue, String)
    check(documentId, String)
    if (this.userId) {
      const userAccessLevel = getAccessLevel(documentId, this.userId)
      if (userAccessLevel) {
        return Tags.insert({label: tagLabel, value: tagValue, parentId: documentId, type: 'document'})
      } else {
        throw new Meteor.Error(403, 'Not enough access rights to add a tag')
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  removeTagFromDocument (tagId) {
    check(tagId, String)
    if (this.userId) {
      const tag = Tags.findOne({'_id': tagId}, { parentId: 1 })
      if (tag) {
        const userAccessLevel = getAccessLevel(tag.parentId, this.userId)
        if (userAccessLevel) {
          return Tags.remove({'_id': tagId})
        } else {
          throw new Meteor.Error(403, 'Not enough access rights to remove a tag')
        }
      } else {
        throw new Meteor.Error(404)
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  createComment (comment) {
    comment.createdAt = new Date()
    comment.createdBy = this.userId
    delete comment.movedToRevisionsAt
    delete comment.modifiedAt
    delete comment.revisionOf
    if (comment.mentions) {
      let mentionIds = []
      comment.mentions.forEach(function (mention) {
        mentionIds.push(mention.id)
      })
      comment.mentions = mentionIds
    }
    check(comment, DocumentCommentSchema)
    if (this.userId) {
      const userAccessLevel = getAccessLevel(comment.documentId, this.userId)
      if (userAccessLevel && userAccessLevel !== 'view') {
        if (Meteor.isServer && comment.mentions && comment.mentions.length > 0) {
          const document = Documents.findOne({_id: comment.documentId})
          if (document) {
            comment.mentions.forEach((mentionUserId) => {
              sendMentioningEmail(document._id, document.title, comment.text, this.userId, mentionUserId)
            })
          }
        }
        return DocumentComments.insert(comment)
      } else {
        throw new Meteor.Error(403, 'Not enough access rights to add a comment')
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  deleteDocument (documentId) {
    check(documentId, String)
    if (this.userId) {
      // TODO move the document rather than deleting it directly to a trash folder instead
      const document = Documents.findOne({'_id': documentId}, { createdBy: 1 })
      if (document) {
        if (document.createdBy === this.userId) {
          Documents.remove({'_id': documentId, 'createdBy': this.userId})
        } else {
          throw new Meteor.Error(403, 'Not enough access rights to remove this document')
        }
      } else {
        throw new Meteor.Error(404)
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  updateComment (commentId, comment) {
    check(commentId, String)
    comment.modifiedAt = new Date()
    delete comment.movedToRevisionsAt
    delete comment.revisionOf
    if (comment.mentions) {
      let mentionIds = []
      comment.mentions.forEach(function (mention) {
        mentionIds.push(mention.id)
      })
      comment.mentions = mentionIds
    }
    check(comment, DocumentCommentSchema)
    if (this.userId) {
      const oldComment = DocumentComments.findOne({'_id': commentId, createdBy: this.userId})
      if (oldComment) {
        // create a revision for the old comment
        oldComment.revisionOf = oldComment._id
        delete oldComment._id
        oldComment.movedToRevisionsAt = new Date()
        check(oldComment, DocumentCommentSchema)
        DocumentComments.insert(oldComment)
        return DocumentComments.update({'_id': commentId, createdBy: this.userId}, {$set: {text: comment.text, modifiedAt: comment.modifiedAt}})
      } else {
        throw new Meteor.Error(404)
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  addDocumentUserAccess (documentId, userId, permission) {
    check(documentId, String)
    check(userId, String)
    check(permission, String)
    if (this.userId) {
      const userAccessLevel = getAccessLevel(documentId, this.userId)
      if (userAccessLevel && userAccessLevel === 'edit') {
        let docAccess = DocumentAccess.findOne({documentId: documentId}, { fields: { _id: 1 } })
        let docAccessId
        if (docAccess) {
          docAccessId = docAccess._id
        }
        if (!docAccessId) {
          docAccessId = DocumentAccess.insert({
            documentId: documentId,
            userCanView: [],
            userCanComment: [],
            userCanEdit: [],
            groupCanView: [],
            groupCanComment: [],
            groupCanEdit: []
          })
        }
        let addToSetObject = {}
        addToSetObject['user' + permission] = {
          userId: userId,
          addedBy: this.userId,
          addedOn: new Date()
        }
        let updateId = DocumentAccess.update({ '_id': docAccessId }, {
          $addToSet: addToSetObject
        })
        if (updateId) {
          return true
        } else {
          return new Meteor.Error(500)
        }
      } else {
        throw new Meteor.Error(403, 'Not enough access rights to change the document access')
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  removeDocumentUserAccess (documentId, userId) {
    check(documentId, String)
    check(userId, String)
    if (this.userId) {
      const userAccessLevel = getAccessLevel(documentId, this.userId)
      if (userAccessLevel && userAccessLevel === 'edit') {
        let docAccess = DocumentAccess.findOne({documentId: documentId}, { fields: { _id: 1 } })
        if (docAccess) {
          DocumentAccess.update({documentId: documentId}, {$pull: {userCanComment: {userId: userId}, userCanEdit: {userId: userId}, userCanView: {userId: userId}}})
        }
        RequestAccessItems.remove({createdBy: userId, documentId: documentId})
        return true
      } else {
        throw new Meteor.Error(403, 'Not enough access rights to change the document access')
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  addDocumentGroupAccess (documentId, groupId, permission) {
    check(documentId, String)
    check(groupId, String)
    check(permission, String)
    if (this.userId) {
      const userAccessLevel = getAccessLevel(documentId, this.userId)
      if (userAccessLevel && userAccessLevel === 'edit') {
        let docAccess = DocumentAccess.findOne({documentId: documentId}, { fields: { _id: 1 } })
        let docAccessId
        if (docAccess) {
          docAccessId = docAccess._id
        }
        if (!docAccessId) {
          docAccessId = DocumentAccess.insert({
            documentId: documentId,
            userCanView: [],
            userCanComment: [],
            userCanEdit: [],
            groupCanView: [],
            groupCanComment: [],
            groupCanEdit: []
          })
        }
        let addToSetObject = {}
        addToSetObject['group' + permission] = {
          groupId: groupId,
          addedBy: this.userId,
          addedOn: new Date()
        }
        DocumentAccess.update({ '_id': docAccessId }, {
          $addToSet: addToSetObject
        })
      } else {
        throw new Meteor.Error(403, 'Not enough access rights to change the document access')
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  removeDocumentGroupAccess (documentId, groupId) {
    check(documentId, String)
    check(groupId, String)
    if (this.userId) {
      const userAccessLevel = getAccessLevel(documentId, this.userId)
      if (userAccessLevel && userAccessLevel === 'edit') {
        let docAccess = DocumentAccess.findOne({documentId: documentId}, { fields: { _id: 1 } })
        if (docAccess) {
          DocumentAccess.update({documentId: documentId}, {$pull: {groupCanComment: {groupId: groupId}, groupCanEdit: {groupId: groupId}, groupCanView: {groupId: groupId}}})
        }
      } else {
        throw new Meteor.Error(403, 'Not enough access rights to change the document access')
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  getSubDocumentBreadcrumbs (documentId) {
    check(documentId, String)
    let breadcrumbs = []
    let documentSelection = DocumentSelections.findOne({documentId: documentId})
    while (documentSelection) {
      const document = Documents.findOne({_id: documentSelection.parentId}, {fields: {
        title: 1,
        createdAt: 1,
        createdBy: 1
      }})
      breadcrumbs.push({
        documentId: documentSelection.parentId,
        document: document
      })
      documentSelection = DocumentSelections.findOne({documentId: documentSelection.parentId})
    }
    // TODO add document selection deletion when the document is deleted
    return breadcrumbs.reverse()
  }
})

export const getDocument = function (id, action, permission, accessKey, callback) {
  let args = {
    id: id,
    action: action,
    permission: permission,
    accessKey: accessKey
  }
  check(args, Match.OneOf({
    id: String
  }, {
    id: String,
    action: String,
    permission: String,
    accessKey: String
  }))
  check(arguments, Match.Any)
  if (this.userId) {
    let document
    if (action === 'shared' && permission === 'CanView' && accessKey) {
      const documentAccessObj = DocumentAccess.findOne({ documentId: id, 'linkCanView.linkId': accessKey }, { fields: { _id: 1 } })
      if (documentAccessObj) {
        return [
          Documents.findOne({ '_id': id }),
          DocumentAccess.findOne({documentId: id})
        ]
      } else {
        throw new Meteor.Error(403, 'Access denied for this sharing link')
      }
    } else if (action === 'shared' && (permission === 'CanEdit' || permission === 'CanComment') && accessKey) {
      let filterObj = {documentId: id}
      filterObj['link' + permission + '.linkId'] = accessKey
      const docAccess = DocumentAccess.findOne(filterObj, { fields: { _id: 1 } })
      if (docAccess) {
        return [
          Documents.findOne({ '_id': id }),
          DocumentAccess.findOne({documentId: id})
        ]
      } else {
        throw new Meteor.Error(403, 'This sharing link is not valid')
      }
    } else {
      document = Documents.findOne({ '_id': id })
      if (document && document.createdBy === this.userId) {
        return [
          document,
          DocumentAccess.findOne({documentId: id})
        ]
      } else if (document) {
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
              { documentId: id },
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
            document,
            DocumentAccess.findOne({documentId: id})
          ]
        } else {
          // the user doesn't have access
          throw new Meteor.Error(403, 'Access denied')
        }
      } else {
        // no document found for this id
        console.error('Did not find the document with id=', id)
        throw new Meteor.Error(404, 'Did not find the document with id=' + id)
      }
    }
  } else {
    throw new Meteor.Error(401, 'Unauthorized')
  }
}

rateLimit({
  methods: [
    'changeDocumentTitle',
    'createDocument',
    'createSubDocument',
    'createComment',
    'deleteDocument',
    'updateComment',
    'addDocumentUserAccess',
    'removeDocumentUserAccess',
    'addDocumentGroupAccess',
    'removeDocumentGroupAccess',
    'getSubDocumentBreadcrumbs'
  ],
  limit: 20,
  timeRange: 10000
})

rateLimit({
  methods: [
    'addTagToDocument',
    'removeTagFromDocument'
  ],
  limit: 50,
  timeRange: 10000
})
