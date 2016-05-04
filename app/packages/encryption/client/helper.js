import { Meteor } from 'meteor/meteor'
import { Tests } from '../lib/collections'
// TODO fix package loading if possible
// import { CryptoJS } from 'meteor/jparker:crypto-aes'

Meteor.startup(function () {
  Tests.before.insert(function (userId, doc) {
    doc.data_enc = global.CryptoJS.AES.encrypt(doc.data, 'Test123').toString()
    doc._encrypted = true

    delete doc.data
  })
})
