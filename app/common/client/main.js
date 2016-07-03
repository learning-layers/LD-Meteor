import { Meteor } from 'meteor/meteor'

global.window.AdminConfig = {
  name: 'Living Documents',
  adminEmails: [ Meteor.settings.public.initialUser.email ],
  collections: {
    DocumentsCollection: {}
  }
}

global.window.Users = Meteor.users
