import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Match } from 'meteor/check'
// TODO fix package loading if possible
// import { CryptoJS } from 'meteor/jparker:crypto-aes'

SimpleSchema.extendOptions({
  placeholder: Match.Optional(String),
  encrypted: Match.Optional(Boolean)
})

export const TestsSchema = new SimpleSchema({
  data: {
    type: String,
    label: 'data',
    max: 600,
    placeholder: 'test',
    encrypted: true
  },
  data_enc: {
    type: String,
    label: 'data_enc',
    max: 600
  },
  _encrypted: {
    type: Boolean,
    label: '_encrypted'
  }
})

let _Tests = new Mongo.Collection('tests', {
  transform: function (doc) {
    if (Meteor.isClient) {
      if (doc._encrypted) {
        doc.data = global.CryptoJS.AES.decrypt(doc.data_enc, 'Test123').toString(global.CryptoJS.enc.Utf8)
        delete doc.data_enc
        delete doc._encrypted
      }
      if (doc.data.indexOf('9') !== -1) {
        return doc
      }
      return {valid: false} // TODO add client-side transform schema validation
    }
    return doc
  }
})

export const Tests = _Tests
