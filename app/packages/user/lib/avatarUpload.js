import { Uploads } from '../../fileUpload/lib/collections'
import { Meteor } from 'meteor/meteor'

function humanFileSize (bytes, si) {
  var thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  var u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
}

if (!global.fileUpload) {
  global.fileUpload = {
    beforeUploadInterceptors: [],
    afterUploadInterceptors: []
  }
}

global.fileUpload.beforeUploadInterceptors.push({
  collection: 'user',
  uploadType: 'avatar',
  onBeforeUpload: function (file) {
    var allowedExt = ['png', 'jpg', 'jpeg']
    var allowedMaxSize = 100000 * 10 * 400 // 400 MB
    if (file.size <= allowedMaxSize) {
      if (!file.ext) {
        file.ext = file.extension
      }
      if (allowedExt.indexOf(file.ext) !== -1) {
        return true
      } else {
        return 'The file you wanted to upload has the extension ' + file.ext + ' only the formats ' + allowedExt.join(', ') + ' are possible to upload'
      }
    } else {
      return 'Max. file size is ' + humanFileSize(allowedMaxSize, true) + ' you\'ve tried to upload ' + humanFileSize(file.size, true)
    }
  },
  onAfterUpload: function (file) {
    // assure that there is only one avatar image for a user
    // after a new one has been uploaded successfully
    let avatarUploads = Uploads.collection.find({'meta.parent.uploadType': 'avatar', 'meta.parent.elementId': Meteor.userId()}).fetch()
    avatarUploads.forEach(function (avatarUpload) {
      if (avatarUpload._id !== file._id) {
        Uploads.collection.remove({ '_id': avatarUpload._id })
      }
    })
  }
})
