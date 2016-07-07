import { SyncedCron } from 'meteor/percolate:synced-cron'
import os from 'os'
import { Meteor } from 'meteor/meteor'

let hostName = os.hostname()
console.log('hostname: ' + hostName)

if (Meteor.settings.private.taskHostName === hostName) {
  var MyLogger = function (opts) {
    console.log('Level', opts.level)
    console.log('Message', opts.message)
    console.log('Tag', opts.tag)
  }

  SyncedCron.config({
    logger: MyLogger
  })

  SyncedCron.add({
    name: 'Example cron job',
    schedule: function (parser) {
      // parser is a later.parse object
      return parser.text('every 5 mins')
    },
    job: function () {
      return 'Example cron job finished'
    }
  })

  SyncedCron.start()
}
