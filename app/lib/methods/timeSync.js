import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { rateLimit } from '../rate-limit'

Meteor.methods({
  'getServerTimeLD': function (clientTime) {
    check(clientTime, Date)
    if (Meteor.isServer && clientTime) {
      return clientTime
    }
  }
})

rateLimit({
  methods: [
    'getServerTimeLD'
  ],
  limit: 4,
  timeRange: 10000
})
