import { Meteor } from 'meteor/meteor'
import { FilesCollection } from 'meteor/ostrio:files'
import Grid from 'gridfs-stream'
import fs from 'fs'

let gfs
if (Meteor.isServer) {
  const mongo = MongoInternals.NpmModules.mongodb.module // eslint-disable-line no-undef
  gfs = Grid(Meteor.users.rawDatabase(), mongo)
}

export let fileUpload = {
  interceptorMap: [],
  interceptors: []
}

let interceptorMap = fileUpload.interceptorMap
Meteor.startup(function () {
  fileUpload.interceptors.forEach(function (interceptor) {
    interceptorMap[interceptor.collection + '#' + interceptor.uploadType] = interceptor
  })
  fileUpload.interceptorMap = interceptorMap
})

export const Uploads = new FilesCollection({
  collectionName: 'Uploads',
  allowClientCode: false,
  debug: Meteor.isServer && process && process.env && process.env.NODE_ENV === 'development',
  onBeforeUpload (file) {
    let interceptor = interceptorMap[file.meta.parent.collection + '#' + file.meta.parent.uploadType]
    if (!interceptor || !interceptor.onBeforeUpload) {
      console.log('No onBeforeUpload interceptor found for collection=' + file.meta.parent.collection + ', uploadType=' + file.meta.parent.uploadType + '!')
      return 'No onBeforeUpload interceptor found for collection=' + file.meta.parent.collection + ', uploadType=' + file.meta.parent.uploadType + '!'
    }
    return interceptor.onBeforeUpload(file)
  },
  onAfterUpload (file) {
    // Move file to GridFS
    Object.keys(file.versions).forEach(versionName => {
      const metadata = { versionName, fileId: file._id, storedAt: new Date() } // Optional
      const writeStream = gfs.createWriteStream({ filename: file.name, metadata })

      fs.createReadStream(file.versions[versionName].path).pipe(writeStream)

      writeStream.on('close', Meteor.bindEnvironment(fileContent => {
        const property = `versions.${versionName}.meta.gridFsFileId`

        // If we store the ObjectID itself, Meteor (EJSON?) seems to convert it to a
        // LocalCollection.ObjectID, which GFS doesn't understand.
        this.collection.update(file._id, { $set: { [property]: fileContent._id.toString() } })
        this.unlink(this.collection.findOne(file._id), versionName) // Unlink files from FS
      }))
    })
    let interceptor = interceptorMap[file.meta.parent.collection + '#' + file.meta.parent.uploadType]
    if (!interceptor || !interceptor.onAfterUpload) {
      console.log('No onAfterUpload interceptor found for collection=' + file.meta.parent.collection + ', uploadType=' + file.meta.parent.uploadType + '!')
      return 'No onAfterUpload interceptor found for collection=' + file.meta.parent.collection + ', uploadType=' + file.meta.parent.uploadType + '!'
    }
    interceptor.onAfterUpload(file)
  },
  interceptDownload (http, file, versionName) {
    // Serve file from GridFS
    const _id = (file.versions[versionName].meta || {}).gridFsFileId
    if (_id) {
      const readStream = gfs.createReadStream({ _id })
      readStream.on('error', err => { throw err })
      readStream.pipe(http.response)
    }
    return Boolean(_id) // Serve file from either GridFS or FS if it wasn't uploaded yet
  },
  /* onAfterRemove (files) {
    // Remove corresponding file from GridFS
    console.log('Deleting gfs items (4)')
    files.forEach(file => {
      console.log('Deleting gfs items (5)')
      Object.keys(file.versions).forEach(versionName => {
        console.log('Deleting gfs items (6)')
        const _id = (file.versions[versionName].meta || {}).gridFsFileId
        console.log('Removing file with _id=' + _id)
        if (_id) {
          console.log('Deleting gfs items (7)')
          /* let fileObjectId
          try {
            fileObjectId = new Meteor.Collection.ObjectID(_id)
          } catch (e) {
            //
          }
          // gfs.remove({ '_id': fileObjectId }, err => { if (err) throw err })*/
          /* gfs.remove({ '_id': 'ObjectID("' + _id + '")' }, err => { if (err) throw err })
        }
      })
    })
  },*/
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

if (Meteor.isServer) {
  Uploads.denyClient()
}

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

if (Meteor.isServer) {
  Uploads.collection._ensureIndex({'meta.parent.collection': 1, 'meta.parent.uploadType': 1, 'meta.parent.elementId': 1, type: 1})
}
