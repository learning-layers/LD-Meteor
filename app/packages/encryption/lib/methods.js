import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { Roles } from 'meteor/alanning:roles'
import { Tests } from './collections'

let _insertNewTestItem = {}
if (Meteor.isClient) {
  let { encryptTestItem } = require('../client/helper')
  _insertNewTestItem = function (doc, callback) {
    Meteor.call('insertNewTestItem', encryptTestItem(doc), true, callback)
  }
}

export const insertNewTestItem = _insertNewTestItem

Meteor.methods({
  insertNewTestItem: function (doc, notDirectlyCalled) {
    check(notDirectlyCalled, Match.OneOf(Boolean, undefined))
    if (this.userId && Roles.userIsInRole(this.userId, ['admin'])) {
      if (notDirectlyCalled) {
        Tests.insert(doc)
      }
    }
  }
})
