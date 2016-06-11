import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import MainLayout from '../ui/mainLayout/MainLayout'
import { mount } from 'react-mounter'

Meteor.startup(function () {
  if (Meteor.settings.public.environment && Meteor.settings.public.environment === 'test') {
    FlowRouter.route('/local', {
      action: function (params, queryParams) {
        mount(MainLayout, {
          isPublic: true,
          header: null,
          content: null,
          helpCenter: null
        })
      }
    })
  }
})
