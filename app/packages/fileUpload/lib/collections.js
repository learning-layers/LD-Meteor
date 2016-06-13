import { Meteor } from 'meteor/meteor'

if (!global.fileUpload) {
  global.fileUpload = {
    beforeUploadInterceptors: [],
    afterUploadInterceptors: []
  }
}

global.fileUpload.interceptorMap = []
let interceptorMap = global.fileUpload.interceptorMap
Meteor.startup(function () {
  global.fileUpload.beforeUploadInterceptors.forEach(function (interceptor) {
    interceptorMap[interceptor.collection + '#' + interceptor.uploadType] = interceptor
  })
  global.fileUpload.interceptorMap = interceptorMap
})

export const Uploads = new Meteor.Files({
  collectionName: 'Uploads',
  debug: false,
  throttle: 256 * 256 * 64,
  // chunkSize: 256*256*4,
  allowClientCode: false,
  onBeforeUpload: function (file) {
    let interceptor = interceptorMap[file.meta.parent.collection + '#' + file.meta.parent.uploadType]
    if (!interceptor || !interceptor.onBeforeUpload) {
      console.log('No onBeforeUpload interceptor found for collection=' + file.meta.parent.collection + ', uploadType=' + file.meta.parent.uploadType + '!')
      return 'No onBeforeUpload interceptor found for collection=' + file.meta.parent.collection + ', uploadType=' + file.meta.parent.uploadType + '!'
    }
    return interceptor.onBeforeUpload(file)
  },
  onAfterUpload: function (file) {
    let interceptor = interceptorMap[file.meta.parent.collection + '#' + file.meta.parent.uploadType]
    if (!interceptor || !interceptor.onAfterUpload) {
      console.log('No onAfterUpload interceptor found for collection=' + file.meta.parent.collection + ', uploadType=' + file.meta.parent.uploadType + '!')
      return 'No onAfterUpload interceptor found for collection=' + file.meta.parent.collection + ', uploadType=' + file.meta.parent.uploadType + '!'
    }
    interceptor.onAfterUpload(file)
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
