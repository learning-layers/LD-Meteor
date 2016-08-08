import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import Fireball from 'fireball-js'
import { Tracker } from 'meteor/tracker'

global.Users = Meteor.users

if (window.applicationCache) {
  let updateFailedTrackerHandler
  window.applicationCache.addEventListener('updateready', function (e) {
    if (updateFailedTrackerHandler) {
      updateFailedTrackerHandler.stop()
      updateFailedTrackerHandler = undefined
    }
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      try {
        window.applicationCache.swapCache()
      } catch (e) {
        //
      }

      if (global.confirm('A new version of this site is available. Do you want to refresh?')) {
        window.location.reload()
      }
    }
  }, false)

  window.applicationCache.addEventListener('error', function (e) {
    if (!updateFailedTrackerHandler) {
      updateFailedTrackerHandler = Tracker.autorun(() => {
        let status = Meteor.status()
        if (status.connected) {
          try {
            window.applicationCache.update()
          } catch (e) {
            console.error('No application cache found. (2)')
          }
        }
      })
    }
  }, false)
} else {
  console.error('No application cache found. (1)')
}

global.window.AdminConfig = {
  name: 'Living Documents',
  adminEmails: [ Meteor.settings.public.initialUser.email ],
  collections: {
    Documents: {},
    Users: {}
  }
}

Meteor.startup(function () {
  let reconnect = function () {
    if (!Meteor.status().connected) {
      Meteor.reconnect()
    }
  }
  reconnect()
  // Set the name of the hidden property and the change event for visibility
  let hidden, visibilityChange
  if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
  } else if (typeof document.mozHidden !== 'undefined') {
    hidden = 'mozHidden'
    visibilityChange = 'mozvisibilitychange'
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
  }

  // If the page is hidden, pause the video;
  // if the page is shown, play the video
  function handleVisibilityChange () {
    if (document[hidden]) {
    } else {
      reconnect()
    }
  }

  // Warn if the browser doesn't support addEventListener or the Page Visibility API
  if (typeof document.addEventListener === 'undefined' || typeof document[hidden] === 'undefined') {
    // global.alert('This webapp requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.')
  } else {
    // Handle page visibility change
    document.addEventListener(visibilityChange, handleVisibilityChange, false)
  }

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
