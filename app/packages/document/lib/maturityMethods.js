import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { Documents } from './collections'
import { getAccessLevel } from './util'

let maturityLevel = []
maturityLevel['default'] = 'default'
maturityLevel['draft'] = 'warning'
maturityLevel['agreed upon'] = 'success'
maturityLevel['stable'] = 'primary'

Meteor.methods({
  changeDocumentMaturity (documentId, newMaturityLevel) {
    check(documentId, String)
    const isAnAllowedMaturityLevel = Match.Where(function (x) {
      check(x, String)
      return maturityLevel[x] !== undefined
    })
    check(newMaturityLevel, isAnAllowedMaturityLevel)
    if (this.userId) {
      const userAccessLevel = getAccessLevel(documentId, this.userId)
      if (userAccessLevel && userAccessLevel === 'edit') {
        return Documents.update({_id: documentId}, {$set: {maturityLevel: newMaturityLevel}})
      } else {
        throw new Meteor.Error(403, 'Not enough access rights to change the maturity level')
      }
    } else {
      throw new Meteor.Error(401)
    }
  }
})
