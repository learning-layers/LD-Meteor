import { Meteor } from 'meteor/meteor'

// The code below is originally written by Sachin 'sachinbhutani' (https://github.com/sachinbhutani)
// for the package flow-db-admin (https://github.com/sachinbhutani/flow-db-admin).
// It has been adjusted that it works fine together with Meteor 1.3 and React

if (Meteor.isClient) {
  const { Session } = require('meteor/session')
  global.window.adminCollectionObject = function (collection) {
    // console.log('Expected=' + Session.get('admin_collection_name'))
    // console.log('Observed=' + collection)
    if (collection === undefined) {
      collection = Session.get('admin_collection_name')
    }
    return global.window[ collection ]
  }
} else {
  let prevCollection // HACK should be done differently
  global.adminCollectionObject = function (collection) {
    if ((!collection || collection === null || collection === 'undefined') && prevCollection) {
      return global[ prevCollection ]
    } else if (collection && collection !== null && collection !== 'undefined') {
      prevCollection = collection
      console.log('collection (2)=' + JSON.stringify(collection))
      return global[ collection ]
    }
  }
}
