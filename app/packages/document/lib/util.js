import { Documents, DocumentAccess } from './collections'
import { Groups } from '../../groups/lib/collections'

const getHighestAccessLevel = function (currentAccessLevel, newAccessLevel) {
  switch (newAccessLevel) {
    case 'edit':
      return newAccessLevel
    case 'comment':
      return currentAccessLevel === 'edit' ? 'edit' : 'comment'
    case 'view':
      return currentAccessLevel === 'edit' || currentAccessLevel === 'comment' ? currentAccessLevel : 'view'
  }
}

export const getAccessLevel = function (documentId, userId) {
  const document = Documents.findOne({'_id': documentId}, { createdBy: 1 })
  if (document.createdBy === userId) {
    return 'edit'
  }
  const documentAccess = DocumentAccess.findOne({ documentId: documentId })
  if (documentAccess) {
    let accessLevel
    documentAccess.userCanView.forEach(function (userCanViewItem) {
      userCanViewItem.userId === userId ? accessLevel = 'view' : null
    })
    if (!accessLevel) {
      documentAccess.userCanComment.forEach(function (userCanCommentItem) {
        userCanCommentItem.userId === userId ? accessLevel = 'comment' : null
      })
    }
    if (!accessLevel) {
      documentAccess.userCanEdit.forEach(function (userCanEditItem) {
        userCanEditItem.userId === userId ? accessLevel = 'edit' : null
      })
    }
    if (!accessLevel) {
      const userGroups = Groups.find({ 'members.userId': userId }, {'_id': 1})
      let userGroupIds = []
      userGroups.forEach(function (userGroup) {
        userGroupIds.push(userGroup._id)
      })
      let found = false
      documentAccess.groupCanEdit.forEach(function (groupCanEditItem) {
        if (!found && userGroupIds.indexOf(groupCanEditItem.groupId) !== -1) {
          accessLevel = getHighestAccessLevel(accessLevel, 'edit')
          found = true
        }
      })
      if (!found) {
        documentAccess.groupCanComment.forEach(function (groupCanCommentItem) {
          if (!found && userGroupIds.indexOf(groupCanCommentItem.groupId) !== -1) {
            accessLevel = getHighestAccessLevel(accessLevel, 'comment')
            found = true
          }
        })
      }
      if (!found) {
        documentAccess.groupCanView.forEach(function (groupCanViewItem) {
          if (!found && userGroupIds.indexOf(groupCanViewItem.groupId) !== -1) {
            accessLevel = getHighestAccessLevel(accessLevel, 'view')
            found = true
          }
        })
      }
    }
    return accessLevel
  } else {
    return false
  }
}
