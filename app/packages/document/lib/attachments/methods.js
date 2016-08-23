import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { DocumentInfoCaches } from '../../lib/attachments/collections'
import { Uploads } from '../../../fileUpload/lib/collections'
import Grid from 'gridfs-stream'

let gfs
if (Meteor.isServer) {
  const mongo = MongoInternals.NpmModules.mongodb.module // eslint-disable-line no-undef
  gfs = Grid(Meteor.users.rawDatabase(), mongo)
}

Meteor.methods({
  deleteDocumentAttachment: function (attachmentId, documentId) {
    check(attachmentId, String)
    check(documentId, String)
    if (this.userId) {
      let filterArgs = {_id: attachmentId, 'meta.parent.collection': 'document', 'meta.parent.uploadType': 'attachment', 'meta.parent.elementId': documentId}
      let fileUpload = Uploads.collection.findOne(filterArgs)
      if (fileUpload) {
        let writeResult = Uploads.collection.remove(filterArgs)
        if (writeResult) {
          DocumentInfoCaches.update({documentId: documentId}, {$inc: {fileAttachmentCounter: -1}})
        } else {
          throw new Meteor.Error(500, 'Couldn\'t remove file attachment')
        }
        Object.keys(fileUpload.versions).forEach(versionName => {
          const _id = (fileUpload.versions[ versionName ].meta || {}).gridFsFileId
          if (_id) {
            gfs.remove({ '_id': _id }, (err) => { if (err) { throw err } })
          }
        })
      } else {
        throw new Meteor.Error(404)
      }
    } else {
      throw new Meteor.Error(401)
    }
  }
})
