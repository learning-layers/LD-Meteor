import { Meteor } from 'meteor/meteor'
import { Uploads } from '../../../fileUpload/lib/collections'
import { UPLOADS_DEFAULT } from '../../../fileUpload/server/uploadProjections'
import { Roles } from 'meteor/alanning:roles'

Meteor.publish('helpVideoAttachments', function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'super-admin', Roles.GLOBAL_GROUP)) {
    return Uploads.collection.find({
      'meta.parent.collection': 'helpvideos',
      'meta.parent.uploadType': 'helpvideo',
      'meta.parent.elementId': 'admin'
    }, UPLOADS_DEFAULT)
  }
})
