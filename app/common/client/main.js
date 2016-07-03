import { Meteor } from 'meteor/meteor'
global.Users = Meteor.users

global.window.AdminConfig = {
  name: 'Living Documents',
  adminEmails: [ Meteor.settings.public.initialUser.email ],
  collections: {
    DocumentsCollection: {},
    Users: {}
  }
}
