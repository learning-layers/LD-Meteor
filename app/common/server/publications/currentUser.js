import { Meteor } from 'meteor/meteor'
import { Uploads } from '../../../packages/fileUpload/lib/collections'
import { USERS_DEFAULT } from '../../../packages/user/server/userProjections'
import { UPLOADS_DEFAULT } from '../../../packages/fileUpload/server/uploadProjections'

Meteor.publish('currentUserDetails', function () {
  if (this.userId) {
    return [
      Meteor.users.find({'_id': this.userId}, USERS_DEFAULT),
      Uploads.collection.find({
        'meta.parent.collection': 'user',
        'meta.parent.uploadType': 'avatar',
        'meta.parent.elementId': this.userId
      }, UPLOADS_DEFAULT)
    ]
  }
  return []
})
