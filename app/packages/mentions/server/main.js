import { Meteor } from 'meteor/meteor'
import { ServerArgs } from '../../serverargs/lib/collections'
import { check } from 'meteor/check'
import { USERS_DEFAULT } from '../../user/server/userProjections'

Meteor.publish('mentions', function (initialArgs) {
  check(initialArgs, {
    mentionSearch: String
  })
  let connectionId = this.connection.id
  let serverArgs = ServerArgs.findOne({'connectionId': connectionId, 'itemName': 'mentions'})
  if (serverArgs) {
    ServerArgs.update({'_id': serverArgs._id}, {'connectionId': connectionId, 'itemName': 'mentions', args: initialArgs})
  } else {
    ServerArgs.insert({'connectionId': connectionId, itemName: 'mentions', args: initialArgs})
  }
  this.autorun(function () {
    let serverArgs = ServerArgs.findOne({'connectionId': connectionId, 'itemName': 'mentions'})
    if (serverArgs && serverArgs.args.mentionSearch.length > 0) {
      return Meteor.users.find({
        'profile.name': {$regex: '^' + serverArgs.args.mentionSearch, $options: 'i'}
      }, USERS_DEFAULT)
    } else {
      return []
    }
  })
  this.onStop(() => {
    ServerArgs.remove({'connectionId': connectionId, 'itemName': 'mentions'})
  })
})
