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
    console.log('Successfully uploaded avatar!!!')
    console.log(file)
  }
})
