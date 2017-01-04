import { Meteor } from 'meteor/meteor'
import { BrowserPolicy } from 'meteor/browser-policy-common'
import { JsonRoutes } from 'meteor/simple:json-routes'
import { Accounts } from 'meteor/accounts-base'
import { UserPositions } from '../../packages/dashboard/lib/collections'
import { check, Match } from 'meteor/check'
global.check = check
global.Match = Match
import { Throttle } from 'meteor/zeroasterisk:throttle'
import { ThrottleAccounts } from 'meteor/zeroasterisk:throttle-accounts'

let isProdEnv = global.isProdEnv

global.hasAgreedToTOS = function (user) {
  if (user && user.tos) {
    let hasAgreedToTOS = true
    user.tos.forEach(function (tosItem) {
      if (!tosItem.agreed) {
        hasAgreedToTOS = false
      }
    })
    return hasAgreedToTOS
  }
  return false
}

/**
 * Account configuration
 */
if (Meteor.settings.private.email.from) {
  Accounts.emailTemplates.from = Meteor.settings.private.email.from
}

if (Meteor.isServer) {
  // Set the "scope" to "user specific" so every key gets appended w/ userId
  // Throttle.setScope('user') // default = global

  // Show debug messages in the server console.log()
  Throttle.setDebugMode(false) // default = false

  // Disable client-side methods (event more secure)
  Throttle.setMethodsAllowed(false) // default = true

  // Accounts.validateLoginAttempt()
  ThrottleAccounts.login('global', 20, 1000, 'Under Heavy Load - too many login attempts')
  ThrottleAccounts.login('ip', 3, 1000, 'Only 3 Login Attempts from the same IP every second')
  ThrottleAccounts.login('connection', 8, 10000, 'Only 8 Login Attempts from the same DDP connection every 10 seconds')

  // Accounts.validateNewUser()
  ThrottleAccounts.create('global', 20, 1000, 'Under Heavy Load - too many accounts created')
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
  // BrowserPolicy.framing.allowAll()
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
    'vjs.zencdn.net',
    'randomuser.me',
    'static-cdn.jtvnw.net',
    'api.learnenv.com',
    'learnenv.de:9001',
    'rawgit.com'
  ]

  if (!isProdEnv()) {
    // allow hot reloading in dev mode
    trustedOrigins.push('localhost:3002')
    trustedOrigins.push('localhost:9001')
    trustedOrigins.push('localhost')
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

  BrowserPolicy.content.allowOriginForAll('blob:')
  BrowserPolicy.content.allowScriptOrigin('blob:')

  var trustedFrameOrigins = [
    '*.youtube.com'
  ]

  if (!isProdEnv()) {
    trustedFrameOrigins.push('localhost:9001')
  }

  trustedFrameOrigins.forEach(function (origin) {
    origin = 'https://' + origin
    BrowserPolicy.content.allowFrameOrigin(origin)
  })

  trustedFrameOrigins.forEach(function (origin) {
    origin = 'http://' + origin
    BrowserPolicy.content.allowFrameOrigin(origin)
  })
  console.log('BrowserPolicy configured')

  // Mail configuration
  if (Meteor.settings.private.email.url && isProdEnv()) {
    process.env.MAIL_URL = Meteor.settings.private.email.url
  }

  // delete userPosition data
  UserPositions.remove({})
})

global.Users = Meteor.users

global.AdminConfig = {
  name: 'Living Documents',
  adminEmails: [ Meteor.settings.private.initialUser.email ],
  collections: {
    Documents: {},
    Users: {}
  }
}
