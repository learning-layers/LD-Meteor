import { Groups } from './collections'

const checkIfUserIsAMember = function (members, userId) {
  for (var i = 0, len = members.length; i < len; i++) {
    if (members[i].userId === userId) {
      return true
    }
  }
  return false
}

export const isMemberInGroup = function (groupId, userId) {
  const group = Groups.findOne({ _id: groupId })
  if (group) {
    return group.createdBy === userId || checkIfUserIsAMember(group.members, userId)
  } else {
    return false
  }
}
