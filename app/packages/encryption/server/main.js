import { Meteor } from 'meteor/meteor'
import { Tests } from '../lib/collections'

Meteor.publish('testData', function () {
  return Tests.find()
})
