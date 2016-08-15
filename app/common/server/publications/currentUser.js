import { Meteor } from 'meteor/meteor'
import { Uploads } from '../../../packages/fileUpload/lib/collections'
import { USERS_DEFAULT } from '../../../packages/user/server/userProjections'
import { UPLOADS_DEFAULT } from '../../../packages/fileUpload/server/uploadProjections'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

Meteor.publish('currentUserDetails', function () {
  if (this.userId) {
    return [
      Meteor.users.find({'_id': this.userId}, USERS_DEFAULT),
      Uploads.collection.find({ // TODO add a preview image of the avatar instead of the large version
        'meta.parent.collection': 'user',
        'meta.parent.uploadType': 'avatar',
        'meta.parent.elementId': this.userId
      }, UPLOADS_DEFAULT)
    ]
  }
  return []
})

DDPRateLimiter.addRule({
  name: 'currentUserDetails',
  type: 'subscription',
  connectionId () { return true }
}, 7, 1000)
