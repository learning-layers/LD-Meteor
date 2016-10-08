import { fileUpload } from '../../../fileUpload/lib/collections'

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
  collection: 'helpvideos',
  uploadType: 'helpvideo',
  allowedExtensions: ['*'],
  allowedSize: 100000 * 10 * 400, // 400 MB
  onBeforeUpload: function (file) {
    var allowedExt = this.allowedExtensions
    var allowedMaxSize = this.allowedSize
    if (file.size <= allowedMaxSize) {
      if (!file.ext) {
        file.ext = file.extension
      }
      if (allowedExt[0] === '*' || allowedExt.indexOf(file.ext) !== -1) {
        return true
      } else {
        return 'The file you wanted to upload has the extension ' + file.ext + ' only the formats ' + allowedExt.join(', ') + ' are possible to upload'
      }
    } else {
      return 'Max. file size is ' + humanFileSize(allowedMaxSize, true) + ' you\'ve tried to upload ' + humanFileSize(file.size, true)
    }
  },
  onAfterUpload: function (file) {
    /* if (file && file.meta && file.meta.parent && file.meta.parent.collection === 'document' && file.meta.parent.elementId && file.meta.parent.uploadType === 'attachment') {
      DocumentInfoCaches.update({documentId: file.meta.parent.elementId}, {$inc: {fileAttachmentCounter: 1}})
    }*/
  }
})
