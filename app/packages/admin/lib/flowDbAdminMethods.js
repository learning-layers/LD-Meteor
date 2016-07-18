import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { Roles } from 'meteor/alanning:roles'

// The code below is originally written by Sachin 'sachinbhutani' (https://github.com/sachinbhutani)
// for the package flow-db-admin (https://github.com/sachinbhutani/flow-db-admin).
// It has been adjusted that it works fine together with Meteor 1.3 and React

let prevCollection // HACK should be done differently
Meteor.methods({
  adminRemoveMongoDoc: function (collection, _id) {
    if (Meteor.isServer) {
      check(arguments, [ Match.Any ])
      if (Roles.userIsInRole(this.userId, [ 'admin' ])) {
        if (collection === 'Users') {
          Meteor.users.remove({ _id: _id })
        } else {
          // global[ collection ].remove({_id:_id})
          console.log('collection (1)=' + JSON.stringify(collection))
          if ((!collection || collection === null || collection === 'undefined') && prevCollection) {
            console.log('collection (1.1)=' + JSON.stringify(prevCollection))
            global[ prevCollection ].remove({ _id: _id })
          } else if (collection && collection !== null && collection !== 'undefined') {
            console.log('collection (1.2)=' + JSON.stringify(collection))
            global[ collection ].remove({ _id: _id })
          } else {
            console.log('no collection and no previous collection found')
          }
        }
      }
    }
  }
})

