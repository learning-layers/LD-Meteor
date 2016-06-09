import { Meteor } from 'meteor/meteor'

Meteor.methods({
  agreeToTOS: function () {
    if (this.userId) {
      let user = Meteor.users.findOne({ '_id': this.userId })
      if (user) {
        let tosItem = {name: 'general', createdAt: new Date(), agreed: true}
        let tos = [tosItem]
        if (user.tos) {
          Meteor.users.update({'_id': this.userId}, {$addToSet: {tos: tosItem}})
        } else {
          Meteor.users.update({'_id': this.userId}, {$set: {tos: tos}})
        }
      }
    }
    if (Meteor.isServer) {
      return true
    }
  }
})
