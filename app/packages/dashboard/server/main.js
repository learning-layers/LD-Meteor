import { Meteor } from 'meteor/meteor'
import { Groups } from '../../groups/lib/collections'
import { UserPositions } from '../../dashboard/lib/collections'
import { USERS_DEFAULT } from '../../user/server/userProjections'

function arrayUnique (array) {
  var a = array.concat()
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) {
        a.splice(j--, 1)
      }
    }
  }

  return a
}

Meteor.publish('activeUserPositions', function () {
  const groupMemberships = Groups.find({$or: [
    {'members.userId': this.userId},
    {createdBy: this.userId}
  ]}).fetch()

  let userIds = []
  groupMemberships.forEach((groupMembership) => {
    if (groupMembership.createdBy !== this.userId) {
      userIds.push(groupMembership.createdBy)
    }
    groupMembership.members.forEach(function (member) {
      userIds.push(member.userId)
    })
  })
  console.log(userIds)
  userIds = arrayUnique(userIds)
  return [
    Meteor.users.find({_id: { $in: userIds }}, USERS_DEFAULT),
    UserPositions.find({ userId: {$in: userIds} })
  ]
})
