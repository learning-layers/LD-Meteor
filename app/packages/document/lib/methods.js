import { Meteor } from 'meteor/meteor'
import { Documents } from './collections'
import { DocumentSchema, DocumentCommentSchema } from './schema'
import { check, Match } from 'meteor/check'
import { Tags } from '../../tags/lib/collections'
import { DocumentComments, DocumentAccess } from '../lib/collections'
import { Groups } from '../../groups/lib/collections'

Meteor.methods({
  changeDocumentTitle: function (documentId, documentTitle) {
    check(documentId, String)
    check(documentTitle, String)
    if (this.userId) {
      Documents.update({'_id': documentId}, {$set: {title: documentTitle}})
      return true
    }
    return false
  },
  createDocument: function (document) {
    document.createdAt = new Date()
    document.createdBy = this.userId
    check(document, DocumentSchema)
    return Documents.insert(document)
  },
  addTagToDocument: function (tagLabel, tagValue, documentId) {
    check(tagLabel, String)
    check(tagValue, String)
    check(documentId, String)
    if (this.userId) {
      // TODO check that the user has access and is allowed to add tags
      return Tags.insert({label: tagLabel, value: tagValue, parentId: documentId, type: 'document'})
    } else {
      throw new Meteor.Error(401)
    }
  },
  removeTagFromDocument: function (tagId) {
    check(tagId, String)
    if (this.userId) {
      return Tags.remove({'_id': tagId})
    } else {
      throw new Meteor.Error(401)
    }
  },
  createComment: function (comment) {
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
      return DocumentComments.insert(comment)
    } else {
      throw new Meteor.Error(401)
    }
  },
  deleteDocument: function (documentId) {
    check(documentId, String)
    if (this.userId) {
      Documents.remove({'_id': documentId, 'createdBy': this.userId})
    } else {
      throw new Meteor.Error(401)
    }
  },
  updateComment: function (commentId, comment) {
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
      oldComment.revisionOf = oldComment._id
      delete oldComment._id
      oldComment.movedToRevisionsAt = new Date()
      check(oldComment, DocumentCommentSchema)
      DocumentComments.insert(oldComment)
      return DocumentComments.update({'_id': commentId, createdBy: this.userId}, {$set: {text: comment.text, modifiedAt: comment.modifiedAt}})
    } else {
      throw new Meteor.Error(401)
    }
  },
  addDocumentUserAccess: function (documentId, userId, permission) {
    check(documentId, String)
    check(userId, String)
    check(permission, String)
    if (this.userId) {
      let docAccess = DocumentAccess.findOne({documentId: documentId})
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
      throw new Meteor.Error(401)
    }
  },
  removeDocumentUserAccess (documentId, userId) {
    check(documentId, String)
    check(userId, String)
    if (this.userId) {
      let docAccess = DocumentAccess.findOne({documentId: documentId})
      if (docAccess) {
        DocumentAccess.update({documentId: documentId}, {$pull: {userCanComment: {userId: userId}, userCanEdit: {userId: userId}, userCanView: {userId: userId}}})
      }
      return true
    }
  },
  addDocumentGroupAccess: function (documentId, groupId, permission) {
    check(documentId, String)
    check(groupId, String)
    check(permission, String)
    if (this.userId) {
      let docAccess = DocumentAccess.findOne({documentId: documentId})
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
      throw new Meteor.Error(401)
    }
  },
  removeDocumentGroupAccess (documentId, groupId) {
    check(documentId, String)
    check(groupId, String)
    if (this.userId) {
      let docAccess = DocumentAccess.findOne({documentId: documentId})
      if (docAccess) {
        DocumentAccess.update({documentId: documentId}, {$pull: {groupCanComment: {groupId: groupId}, groupCanEdit: {groupId: groupId}, groupCanView: {groupId: groupId}}})
      }
    }
  },
  checkHasAccessToDocument (documentId) {
    check(documentId, String)
    return {
      result: true
    }
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
      const documentAccessObj = DocumentAccess.findOne({ documentId: id, 'linkCanView.linkId': accessKey })
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
      const docAccess = DocumentAccess.findOne(filterObj)
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
      } else if (!document) {
        // no document found for this id
        console.error('Did not find the document with id=', id)
        throw new Meteor.Error(404, 'Did not find the document with id=' + id)
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
      }
    }
  } else {
    throw new Meteor.Error(401, 'Unauthorized')
  }
}
