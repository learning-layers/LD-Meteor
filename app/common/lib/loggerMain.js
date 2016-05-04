import { Meteor } from 'meteor/meteor'
import { Logger } from 'meteor/ostrio:logger'
import { LoggerMongo } from 'meteor/ostrio:loggermongo'

global.log = new Logger()
let LogMongo = new LoggerMongo(global.log, {
  collectionName: 'AppLogs'
}).enable({
  enable: true,
  // filter: ['ERROR', 'FATAL', 'WARN'], /* Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', 'TRACE', '*' */
  client: false, /* This allows to call, but not execute on Client */
  server: true   /* Calls from client will be executed on Server */
})

if (Meteor.isClient) {
  Meteor.startup(function () {
    // TODO write tests
    /* Store original window.onerror */
    var _WoE = window.onerror

    window.onerror = function (msg, url, line) {
      global.log.error(msg, {file: url, onLine: line})
      if (_WoE) {
        _WoE.apply(this, arguments)
      }
    }
  })
}

if (Meteor.isServer) {
  LogMongo.collection._ensureIndex({level: 1}, {background: true})
  LogMongo.collection._ensureIndex({userId: 1}, {background: true})
  LogMongo.collection._ensureIndex({date: 1}, {background: true})
  LogMongo.collection._ensureIndex({timestamp: 1}, {background: true})
}
