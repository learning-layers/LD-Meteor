import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { FriendRequests, FriendLists } from './collections'
import { rateLimit } from '../../../common/lib/rate-limit'

const createFriendListIfNotExists = function (userId, callback) {
  let friendList = FriendLists.findOne({userId: userId}, {_id: 1})
  let friendListId
  if (friendList) {
    friendListId = friendList._id
  } else {
    try {
      friendListId = FriendLists.insert({
        userId: userId,
        groups: [],
        friendIds: []
      })
    } catch (e) {
      callback(e, null)
    }
  }
  if (friendListId) {
    callback(null, friendListId)
  }
}

const createFriendListIfNotExistsSync = Meteor.wrapAsync(createFriendListIfNotExists)

Meteor.methods({
  sendFriendRequest: function (userId) {
    check(userId, String)
    if (this.userId) {
      return FriendRequests.insert({ requester: this.userId, user: userId, status: 'pending', createdAt: new Date() })
    } else {
      throw new Meteor.Error(401)
    }
  },
  acceptFriendRequest: function (friendRequestId) {
    check(friendRequestId, String)
    if (this.userId) {
      const friendRequest = FriendRequests.findOne({ _id: friendRequestId })
      if (friendRequest) {
        try {
          const friendListId = createFriendListIfNotExistsSync(this.userId)
          console.log(friendListId)
          FriendLists.update({ _id: friendListId }, {$addToSet: { friendIds: friendRequest.requester }})
          console.log(friendListId)
          const userFriendListId = createFriendListIfNotExistsSync(friendRequest.requester)
          console.log(userFriendListId)
          FriendLists.update({ _id: userFriendListId }, {$addToSet: { friendIds: this.userId }})
          console.log(userFriendListId)
          FriendRequests.update({_id: friendRequest._id}, {$set: {modifiedAt: new Date(), status: 'accepted'}})
        } catch (e) {
          console.log(e)
          throw new Meteor.Error(500)
        }
      } else {
        throw new Meteor.Error(404)
      }
    } else {
      throw new Meteor.Error(401)
    }
  },
  denyFriendRequest: function (friendRequestId) {
    check(friendRequestId, String)
    if (this.userId) {
      createFriendListIfNotExistsSync(this.userId)
    } else {
      throw new Meteor.Error(401)
    }
  },
  ignoreFriendRequest: function (friendRequestId) {
    check(friendRequestId, String)
    if (this.userId) {
      createFriendListIfNotExistsSync(this.userId)
    } else {
      throw new Meteor.Error(401)
    }
  }
})

rateLimit({
  methods: [
    'sendFriendRequest',
    'acceptFriendRequest',
    'denyFriendRequest',
    'ignoreFriendRequest'
  ],
  limit: 20,
  timeRange: 10000
})
