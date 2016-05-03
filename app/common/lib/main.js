import { Meteor } from 'meteor/meteor'
import { Logger } from 'meteor/ostrio:logger'
import { LoggerMongo } from 'meteor/ostrio:loggermongo'
import { I18N } from 'meteor/ostrio:i18n'

// TODO polish
if (!global.i18nConfig) {
  global.i18nConfig = {}
}

global.log = new Logger()
let LogMongo = new LoggerMongo(global.log, {
  collectionName: 'AppLogs'
}).enable({
  enable: true,
  // filter: ['ERROR', 'FATAL', 'WARN'], /* Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', 'TRACE', '*' */
  client: false, /* This allows to call, but not execute on Client */
  server: true   /* Calls from client will be executed on Server */
})

Meteor.startup(function () {
  global.i18n = new I18N({driver: 'Object', i18n: global.i18nConfig})
})

if (Meteor.isClient) {
  var isProdEnv = global.isProdEnv = function () {
    if (Meteor.settings.public.isProdEnv && Meteor.settings.public.isProdEnv === true) {
      return true
    } else {
      return false
    }
  }
  Meteor.startup(function () {
    // TODO polish
    // TODO write tests
    /* Store original window.onerror */
    var _WoE = window.onerror

    window.onerror = function (msg, url, line) {
      global.log.error(msg, {file: url, onLine: line})
      if (_WoE) {
        _WoE.apply(this, arguments)
      }
    }
    if (isProdEnv() && Meteor.settings.public.httpsRedirect && Meteor.settings.public.rootUrl && !window.location.href.match('^https')) {
      window.location.href = Meteor.settings.public.rootUrl
    }
  })
}

if (Meteor.isServer) {
  LogMongo.collection._ensureIndex({level: 1}, {background: true})
  LogMongo.collection._ensureIndex({userId: 1}, {background: true})
  LogMongo.collection._ensureIndex({date: 1}, {background: true})
  LogMongo.collection._ensureIndex({timestamp: 1}, {background: true})
  global.isProdEnv = function () {
    return process.env.NODE_ENV === 'production'
  }
  // TODO remove example
  /* Meteor.startup(function () {
    global.log.info('test', 'test', 1)
  }) */
  /* Meteor.startup(function () {
    console.log(global.i18n.get('en', 'main.heading'))
  })*/
}
