import { Tracker } from 'meteor/tracker'
import { Meteor } from 'meteor/meteor'
import EventEmitterInstance from '../EventEmitter'

let initalEmitDone = false
Tracker.autorun(function (comp) {
  let userId = Meteor.userId()
  if (initalEmitDone && !userId) {
    EventEmitterInstance.emit('sidebar-toggle', false)
  } else {
    initalEmitDone = true
  }
})
