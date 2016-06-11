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

export const Uploads = new Meteor.Files({
  collectionName: 'Uploads',
  debug: false,
  throttle: 256 * 256 * 64,
  // chunkSize: 256*256*4,
  allowClientCode: false,
  onBeforeUpload: function (file) {
    var allowedExt = ['mp3', 'm4a', 'zip', 'mp4', 'avi', 'webm']
    var allowedMaxSize = 100000 * 10 * 400
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
  downloadCallback: function (fileObj) {
    var ref = this.params
    if (ref && ref.query && ref.query.download === 'true') {
      return Uploads.collection.update(fileObj._id, {
        $inc: {
          'meta.downloads': 1
        }
      })
    } else {
      return Uploads.collection.find(fileObj._id)
    }
  }
})

// To have sample files in DB we will upload them on server startup:
if (Meteor.isServer) {
  /* Meteor.startup(function () {
   Uploads.load('http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4', {
   fileName: 'Big-Buck-Bunny.mp4'
   });
   }); */
  Meteor.publish('files.videos.all', function () {
    return Uploads.collection.find({})
  })
} else {
  Meteor.subscribe('files.videos.all')
}

Uploads.cacheControl = 'public, max-age=31536000'
