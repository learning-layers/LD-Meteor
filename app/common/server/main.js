import { Meteor } from 'meteor/meteor'
import { BrowserPolicy } from 'meteor/browser-policy-common'
import { JsonRoutes } from 'meteor/simple:json-routes'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import { Accounts } from 'meteor/accounts-base'

let isProdEnv = global.isProdEnv

// setup ssr cache per user
var timeInMillis = 1000 * 10 // 10 secs
FlowRouter.setPageCacheTimeout(timeInMillis)

// once the browser received the html it can render without waiting for JavaScript
FlowRouter.setDeferScriptLoading(true)

/**
 * Account configuration
 */
if (Meteor.settings.private.email.from) {
  Accounts.emailTemplates.from = Meteor.settings.private.email.from
}

/**
 * Startup configuration
 */
Meteor.startup(function () {
  // Browser security settings
  console.log('Server starting up')
  BrowserPolicy.content.disallowInlineScripts()
  BrowserPolicy.content.disallowEval()
  BrowserPolicy.content.allowInlineStyles()
  BrowserPolicy.framing.allowAll()
  BrowserPolicy.content.allowFontDataUrl()

  // Enable cross origin requests for all endpoints
  var trustedClientDomains = [
    // "*",
    'https://app.learnenv.com',
    'https://api.learnenv.com',
    'https://internal.learnenv.com',
    'https://test.learnenv.com'
  ]

  if (!isProdEnv()) {
    trustedClientDomains.push('http://localhost')
  }

  JsonRoutes.setResponseHeaders({
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
    'Access-Control-Allow-Origin': trustedClientDomains.join(', '),
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  })

  var trustedOrigins = [
    'youtube.com',
    '*.youtube.com',
    'fonts.googleapis.com',
    '*.fonts.googleapis.com',
    '*.fonts.gstatic.com',
    'fonts.gstatic.com',
    'video-js.zencoder.com',
    'vjs.zencdn.net'
  ]

  if (!isProdEnv()) {
    // allow hot reloading in dev mode
    trustedOrigins.push('localhost:3002')
  }

  trustedOrigins.forEach(function (origin) {
    origin = 'https://' + origin
    BrowserPolicy.content.allowOriginForAll(origin)
    BrowserPolicy.content.allowScriptOrigin(origin)
  })

  trustedOrigins.forEach(function (origin) {
    origin = 'http://' + origin
    BrowserPolicy.content.allowOriginForAll(origin)
    BrowserPolicy.content.allowScriptOrigin(origin)
  })

  BrowserPolicy.content.allowFrameOrigin('https://*.youtube.com')
  console.log('BrowserPolicy configured')

  // Mail configuration
  if (Meteor.settings.private.email.url && isProdEnv()) {
    process.env.MAIL_URL = Meteor.settings.private.email.url
  }
})
