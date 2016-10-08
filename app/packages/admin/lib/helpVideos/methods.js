import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Uploads } from '../../../fileUpload/lib/collections'
import Grid from 'gridfs-stream'
import { Roles } from 'meteor/alanning:roles'

let gfs
if (Meteor.isServer) {
  const mongo = MongoInternals.NpmModules.mongodb.module // eslint-disable-line no-undef
  gfs = Grid(Meteor.users.rawDatabase(), mongo)
}

Meteor.methods({
  deleteHelpVideoAttachment: function (attachmentId) {
    check(attachmentId, String)
    if (this.userId && Roles.userIsInRole(this.userId, 'super-admin', Roles.GLOBAL_GROUP)) {
      let filterArgs = {_id: attachmentId, 'meta.parent.collection': 'helpvideos', 'meta.parent.uploadType': 'helpvideo', 'meta.parent.elementId': 'admin'}
      let fileUpload = Uploads.collection.findOne(filterArgs)
      if (fileUpload) {
        let writeResult = Uploads.collection.remove(filterArgs)
        if (!writeResult) {
          throw new Meteor.Error(500, 'Couldn\'t remove file attachment')
        }
        if (fileUpload.versions) {
          Object.keys(fileUpload.versions).forEach(versionName => {
            const _id = (fileUpload.versions[versionName].meta || {}).gridFsFileId
            if (_id) {
              gfs.remove({'_id': _id}, (err) => {
                if (err) {
                  throw err
                }
              })
            }
          })
        }
      } else {
        throw new Meteor.Error(404)
      }
    } else {
      throw new Meteor.Error(401)
    }
  }
})
