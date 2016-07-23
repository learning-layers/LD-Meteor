import { Uploads, fileUpload } from '../../fileUpload/lib/collections'
import fs from 'fs'
import { Meteor } from 'meteor/meteor'
import Grid from 'gridfs-stream'

let gfs
if (Meteor.isServer) {
  const mongo = MongoInternals.NpmModules.mongodb.module // eslint-disable-line no-undef
  gfs = Grid(Meteor.users.rawDatabase(), mongo)
}

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

fileUpload.interceptors.push({
  collection: 'user',
  uploadType: 'avatar',
  allowedExtensions: ['png', 'jpg', 'jpeg'],
  allowedSize: 100000 * 10 * 10, // 10 MB
  onBeforeUpload: function (file) {
    var allowedExt = this.allowedExtensions
    var allowedMaxSize = this.allowedSize
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
    if (file && file.meta && file.meta.parent && file.meta.parent.elementId) {
      let avatarUploads = Uploads.collection.find({
        'meta.parent.uploadType': 'avatar',
        'meta.parent.elementId': file.meta.parent.elementId
      }).fetch()
      avatarUploads.forEach(function (avatarUpload) {
        if (avatarUpload._id !== file._id.toString()) {
          Uploads.collection.remove({ '_id': avatarUpload._id })
          if (Meteor.isServer) {
            try {
              fs.unlink(avatarUpload.path, function () {})
            } catch (e) {
              //
            }
            Object.keys(avatarUpload.versions).forEach(versionName => {
              const _id = (avatarUpload.versions[ versionName ].meta || {}).gridFsFileId
              if (_id) {
                gfs.remove({ '_id': _id }, (err) => { if (err) { throw err } })
              }
            })
          }
        }
      })
    }
  }
})
