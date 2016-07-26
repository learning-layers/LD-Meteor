import { Meteor } from 'meteor/meteor'
import { Tests } from './collections'

let _insertNewTestItem = {}
if (Meteor.isClient) {
  let { encryptTestItem } = require('../both/helper')
  _insertNewTestItem = function (doc, callback) {
    Meteor.call('insertNewTestItem', encryptTestItem(doc), true, callback)
  }
}

export const insertNewTestItem = _insertNewTestItem

Meteor.methods({
  insertNewTestItem: function (doc, notDirectlyCalled) {
    if (notDirectlyCalled) {
      Tests.insert(doc)
    }
  }
})
