import { Meteor } from 'meteor/meteor'
import { Uploads } from '../../../packages/fileUpload/lib/collections'

Meteor.publish('currentUserDetails', function () {
  if (this.userId) {
    return [
      Meteor.users.find({'_id': this.userId}, {
        fields: {
          'services': 0,
          'status': 0
        }
      }),
      Uploads.collection.find({'meta.parent.collection': 'user', 'meta.parent.uploadType': 'avatar', 'meta.parent.elementId': this.userId})
    ]
  }
  return []
})
