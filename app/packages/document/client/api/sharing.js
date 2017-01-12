import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import Alert from 'react-s-alert'

export function assignEditOrCommentPermissions (permission, documentId, accessKey, callback) {
  permission = 'can_' + permission
  function camelCase (input) {
    if (input.length > 0) {
      var oldInput = input.substring(1)
      var newfirstletter = input.charAt(0)
      input = newfirstletter.toUpperCase() + oldInput
      return input.replace(/_(.)/g, function (match, group1) {
        return group1.toUpperCase()
      })
    } else {
      return input
    }
  }
  Meteor.call('assignDocumentEditOrCommentPermissions', documentId, camelCase(permission), accessKey, (err, res) => {
    if (err) {
      Alert.error('Oops, there was an error while assigning the new document access permissions. (1)' + err)
    }
    if (res) {
      callback(null, true)
      Alert.success('Successfully applied new document access permissions.')
      FlowRouter.go('/document/' + documentId)
    } else {
      callback(null, false)
      Alert.error('Oops, there was an error while assigning the new document access permissions. (2)')
    }
  })
}

export function setUpAssignNewPermissionsInterval (self, callback) {
  try {
    let noDocumentAccessObjCounter = 0
    let assignNewPermissionsInterval = Meteor.setInterval(() => {
      // wait and make sure the needed props are available
      const {action, permission, accessKey, documentAccess} = self.props
      if (action === 'shared' && (permission === 'edit' || permission === 'comment') && accessKey) {
        if (documentAccess) { // document access object is available
          Meteor.clearInterval(assignNewPermissionsInterval)
          delete self.assignNewPermissionsInterval
          assignEditOrCommentPermissions(permission, documentAccess.documentId, accessKey, callback)
        } else {
          noDocumentAccessObjCounter++
        }
        if (noDocumentAccessObjCounter > 15) {
          // try to wait for the documentAccess obj 15 times
          // if not available cancel action
          console.warn('There might be an error while assigning the new document access permissions.')
          Meteor.clearInterval(assignNewPermissionsInterval)
          delete self.assignNewPermissionsInterval
        }
      }
    }, 250)
    self.assignNewPermissionsInterval = assignNewPermissionsInterval
  } catch (e) {
    console.error(e)
  }
}
