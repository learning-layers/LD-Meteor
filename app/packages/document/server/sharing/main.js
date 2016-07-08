import { Meteor } from 'meteor/meteor'
import { RequestAccessItems } from '../../lib/sharing/collections'

Meteor.publish('requestAccessToDocumentItems', function (args) {
  console.log(args)
  return RequestAccessItems.find({token: args.token, owner: this.userId})
})
