import { Meteor } from 'meteor/meteor'
import { Tests } from './collections'
import { check, Match } from 'meteor/check'

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
    if (notDirectlyCalled) {
      Tests.insert(doc)
    }
  }
})
