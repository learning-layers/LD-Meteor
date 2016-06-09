import { Tracker } from 'meteor/tracker'
import { Meteor } from 'meteor/meteor'

let initalEmitDone = false
Tracker.autorun(function (comp) {
  let userId = Meteor.userId()
  if (initalEmitDone && !userId) {
    global.emitter.emit('sidebar-toggle', false)
  } else {
    initalEmitDone = true
  }
})
