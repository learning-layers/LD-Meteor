import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import Fireball from 'fireball-js'

global.Users = Meteor.users

global.window.AdminConfig = {
  name: 'Living Documents',
  adminEmails: [ Meteor.settings.public.initialUser.email ],
  collections: {
    Documents: {},
    Users: {}
  }
}

Meteor.startup(function () {
  Meteor.setTimeout(function () {
    let scoreObj = Session.get('deviceScore')
    console.debug('scoreObj=' + JSON.stringify(scoreObj))
    let timeDiff
    if (scoreObj) {
      timeDiff = new Date().getTime() - scoreObj.capturedOn.getTime()
      console.debug('scoreObj time diff=', timeDiff)
    }
    if (!scoreObj || timeDiff > 43200000 /* 30 * 24 * 60 * 1000 */) {
      console.time('Fireball scoring')
      Fireball.run({
        runs: 2,
        speedRanges: [
            {min: 0, className: 'speed-of-sloth'},
            {min: 4000, className: 'speed-of-tortoise'},
            {min: 8000, className: 'speed-of-puppy'},
            {min: 16000, className: 'speed-of-cheetah'}
        ]
      })
      Fireball.onSuccess(function (score) {
        console.timeEnd('Fireball scoring')
        Session.set('deviceScore', {
          score: score,
          capturedOn: new Date()
        })
        console.debug('New score set=' + score)
      })
    } else {
      console.debug('Retrieved old score=' + scoreObj.score)
      if (scoreObj.score > 16000) {
        document.getElementsByTagName('body')[0].className += ' speed-of-cheetah'
      } else if (scoreObj.score > 8000) {
        document.getElementsByTagName('body')[0].className += ' speed-of-puppy'
      } else if (scoreObj.score > 4000) {
        document.getElementsByTagName('body')[0].className += ' speed-of-tortoise'
      } else {
        document.getElementsByTagName('body')[0].className += ' speed-of-sloth'
      }
    }
  }, 1000)
})
