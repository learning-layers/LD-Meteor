import { Meteor } from 'meteor/meteor'
import { rateLimit } from '../../../common/lib/rate-limit'

Meteor.methods({
  agreeToTOS: function () {
    if (this.userId) {
      let user = Meteor.users.findOne({ '_id': this.userId }, { fields: { tos: 1 } })
      if (user) {
        let tosItem = {name: 'general', createdAt: new Date(), agreed: true}
        let tos = [tosItem]
        if (user.tos) {
          Meteor.users.update({'_id': this.userId}, {$addToSet: {tos: tosItem}})
        } else {
          Meteor.users.update({'_id': this.userId}, {$set: {tos: tos}})
        }
      }
    } else {
      throw new Meteor.Error(401)
    }
    if (Meteor.isServer) {
      return true // TODO check why this is needed and document it
    }
  }
})

rateLimit({
  methods: [
    'agreeToTOS'
  ],
  limit: 5,
  timeRange: 5000
})
