import { Meteor } from 'meteor/meteor'
import { moment } from 'meteor/momentjs:moment'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'

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
    return process && process.env && process.env.NODE_ENV === 'production'
  }
}

moment.locale('en')

if (Meteor.isServer) {
  var timeInMillis = 1000 * 10 // 10 secs
  FlowRouter.setPageCacheTimeout(timeInMillis)
}
