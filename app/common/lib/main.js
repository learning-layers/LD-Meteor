import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Match } from 'meteor/check'

if (Meteor.isClient) {
  var isProdEnv = global.isProdEnv = function () {
    if (Meteor.settings.public.isProdEnv && Meteor.settings.public.isProdEnv === true) {
      return true
    } else {
      return false
    }
  }
  Meteor.startup(function () {
    if (isProdEnv() && Meteor.settings.public.httpsRedirect && Meteor.settings.public.rootUrl && !window.location.href.match('^https')) {
      window.location.href = Meteor.settings.public.rootUrl
    }
  })
}

if (Meteor.isServer) {
  global.isProdEnv = function () {
    return process.env.NODE_ENV === 'production'
  }
}

SimpleSchema.extendOptions({
  placeholder: Match.Optional(String)
})
