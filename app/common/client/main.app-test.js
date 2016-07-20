/* eslint-env mocha */

import { chai } from 'meteor/practicalmeteor:chai'
import { Meteor } from 'meteor/meteor'

describe('main', function (done) {
  it('loginWithPassword right password works', function (done) {
    Meteor.loginWithPassword('martin@bachl.pro', 'changeme1', function (err, res) {
      if (err) {
        chai.assert.equal(false, true)
        done(err)
      } else {
        chai.assert.equal(true, true)
        done()
      }
    })
  })

  it('loginWithPassword wrong password doesn\'t work', function (done) {
    Meteor.loginWithPassword('martin@bachl.pro', 'notwiththisone', function (err, res) {
      if (err) {
        chai.assert.equal(true, true)
        done()
      } else {
        chai.assert.equal(false, true)
        done()
      }
    })
  })
})
