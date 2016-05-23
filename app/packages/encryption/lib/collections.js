import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
// TODO fix package loading if possible
// import { CryptoJS } from 'meteor/jparker:crypto-aes'

export const Tests = new Mongo.Collection('tests', {
  transform: function (doc) {
    if (Meteor.isClient) {
      if (doc._encrypted) {
        doc.data = global.CryptoJS.AES.decrypt(doc.data_enc, 'Test123').toString(global.CryptoJS.enc.Utf8)
        delete doc.data_enc
        delete doc._encrypted
      }
    }
    return doc
  }
})
