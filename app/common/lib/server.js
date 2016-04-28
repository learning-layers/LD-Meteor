import { Meteor } from 'meteor/meteor'

if (Meteor.isServer) {
  // TODO test if this is a problem: (node) warning: possible EventEmitter memory leak detected. 11 listeners added. Use emitter.setMaxListeners() to increase limit.
  // Could be linked to: https://github.com/meteor/meteor/issues/6247
  require('events').EventEmitter.prototype._maxListeners = 100
  process.setMaxListeners(0)
}
