import { Meteor } from 'meteor/meteor'
import { Documents } from './collections'
import { DocumentSchema, DocumentCommentSchema } from './schema'
import { check } from 'meteor/check'
import { Tags } from '../../tags/lib/collections'
import { DocumentComments, DocumentAccess } from '../lib/collections'

Meteor.methods({
  createDocument: function (document) {
    document.createdAt = new Date()
    document.createdBy = this.userId
    check(document, DocumentSchema)
    return Documents.insert(document)
  },
  addTagToDocument: function (tagLabel, tagValue, documentId) {
    if (this.userId) {
      // TODO check that the user has access and is allowed to add tags
      return Tags.insert({label: tagLabel, value: tagValue, parentId: documentId, type: 'document'})
    } else {
      throw new Meteor.Error(401)
    }
  },
  removeTagFromDocument: function (tagId) {
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
    if (this.userId) {
      Documents.remove({'_id': documentId, 'createdBy': this.userId})
    } else {
      throw new Meteor.Error(401)
    }
  },
  updateComment: function (commentId, comment) {
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
    if (this.userId) {
      let docAccess = DocumentAccess.findOne({documentId: documentId})
      if (docAccess) {
        DocumentAccess.update({documentId: documentId}, {$pull: {userCanComment: {userId: userId}, userCanEdit: {userId: userId}, userCanView: {userId: userId}}})
      }
    }
  },
  addDocumentGroupAccess: function (documentId, groupId, permission) {
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
    if (this.userId) {
      let docAccess = DocumentAccess.findOne({documentId: documentId})
      if (docAccess) {
        DocumentAccess.update({documentId: documentId}, {$pull: {groupCanComment: {groupId: groupId}, groupCanEdit: {groupId: groupId}, groupCanView: {groupId: groupId}}})
      }
    }
  },
  checkHasAccessToDocument (documentId) {
    return {
      result: true
    }
  }
})
