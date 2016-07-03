import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { Roles } from 'meteor/alanning:roles'
import { Mongo } from 'meteor/mongo'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'

// The code below is originally written by Sachin 'sachinbhutani' (https://github.com/sachinbhutani)
// for the package flow-db-admin (https://github.com/sachinbhutani/flow-db-admin).
// It has been adjusted that it works fine together with Meteor 1.3.

FlowRouter.route('/admin', {
  subscriptions: function () {
    this.register('fadminUsers', Meteor.subscribe('adminUsers'))
    this.register('fadminUser', Meteor.subscribe('adminUser'))
    this.register('fadminCollectionsCount', Meteor.subscribe('adminCollectionsCount'))
  },
  triggersEnter: [
    function (context) {
      if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        Meteor.call('adminCheckAdmin')
        // if (typeof AdminConfig.nonAdminRedirectRoute == 'string')
        //	FlowRouter.go(AdminController.nonAdminRedirectRoute);
      }
    },
    function (context) {
      Session.set('adminSuccess', null)
      Session.set('adminError', null)
      Session.set('admin_title', null)
      Session.set('admin_subtitle', null)
      Session.set('admin_collection_name', null)
      Session.set('admin_collection_page', null)
      Session.set('admin_id', null)
      Session.set('admin_doc', null)

      // "/" route
      Session.set('admin_title', 'Dashboard')
      Session.set('admin_collection_name', '')
      Session.set('admin_collection_page', '')
    }
  ],
  action: function () {
    BlazeLayout.render('fAdminLayout', {main: 'AdminDashboard'})
  }
})

FlowRouter.route('/admin/view/:collectionName', {
  subscriptions: function () {
    this.register('fadminUsers', Meteor.subscribe('adminUsers'))
    this.register('fadminUser', Meteor.subscribe('adminUser'))
    this.register('fadminCollectionsCount', Meteor.subscribe('adminCollectionsCount'))
  },
  triggersEnter: [
    function (context) {
      if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        Meteor.call('adminCheckAdmin')
        // if (typeof AdminConfig.nonAdminRedirectRoute == 'string')
        //	FlowRouter.go(AdminController.nonAdminRedirectRoute);
      }
    },
    function (context) {
      Session.set('adminSuccess', null)
      Session.set('adminError', null)
      Session.set('admin_title', null)
      Session.set('admin_subtitle', null)
      Session.set('admin_collection_name', null)
      Session.set('admin_collection_page', null)
      Session.set('admin_id', null)
      Session.set('admin_doc', null)

      // "/" route
      Session.set('admin_title', context.params.collectionName)
      Session.set('admin_subtitle', 'View')
      Session.set('admin_collection_page', 'view')
      Session.set('admin_collection_name', context.params.collectionName)
    }
  ],
  triggersExit: [
    function (context) {
      BlazeLayout.render('fAdminLayout', {main: 'AdminLoading'})
    }
  ],
  action: function () {
    BlazeLayout.render('fAdminLayout', {main: 'AdminDashboardView'})
  }
})

FlowRouter.route('/admin/new/:collectionName', {
  subscriptions: function () {
    this.register('fadminUsers', Meteor.subscribe('adminUsers'))
    this.register('fadminUser', Meteor.subscribe('adminUser'))
    this.register('fadminCollectionsCount', Meteor.subscribe('adminCollectionsCount'))
  },
  triggersEnter: [
    function (context) {
      if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        Meteor.call('adminCheckAdmin')
        // if (typeof AdminConfig.nonAdminRedirectRoute == 'string')
        //	FlowRouter.go(AdminController.nonAdminRedirectRoute);
      }
    },
    function (context) {
      Session.set('adminSuccess', null)
      Session.set('adminError', null)
      Session.set('admin_title', null)
      Session.set('admin_subtitle', null)
      Session.set('admin_collection_name', null)
      Session.set('admin_collection_page', null)
      Session.set('admin_id', null)
      Session.set('admin_doc', null)

      // "/" route
      Session.set('admin_title', context.params.collectionName)
      Session.set('admin_subtitle', 'Create New')
      Session.set('admin_collection_page', 'new')
      Session.set('admin_collection_name', context.params.collectionName)
    }
  ],
  triggersExit: [
    function (context) {
      BlazeLayout.render('fAdminLayout', {main: 'AdminLoading'})
    }
  ],
  action: function (params) {
    if (params.collectionName === 'Users') {
      BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardUsersNew' })
    } else {
      BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardNew' })
    }
  }
})

function parseID (id) {
  if (typeof id === 'string') {
    if (id.indexOf('ObjectID') > -1) {
      return new Mongo.ObjectID(id.slice(id.indexOf('"') + 1, id.lastIndexOf('"')))
    } else {
      return id
    }
  } else {
    return id
  }
}

FlowRouter.route('/admin/edit/:collectionName/:_id', {
  subscriptions: function (params) {
    this.register('fadminUsers', Meteor.subscribe('adminUsers'))
    this.register('fadminUser', Meteor.subscribe('adminUser'))
    this.register('fadminCollectionsCount', Meteor.subscribe('adminCollectionsCount'))
    if (params.collectionName !== 'Users') {
      this.register('admindoc2edit', Meteor.subscribe('adminCollectionDoc', params.collectionName, parseID(params._id)))
    }
  },
  triggersEnter: [
    function (context) {
      if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        Meteor.call('adminCheckAdmin')
        // if (typeof AdminConfig.nonAdminRedirectRoute == 'string')
        //	FlowRouter.go(AdminController.nonAdminRedirectRoute);
      }
    },
    function (context) {
      Session.set('adminSuccess', null)
      Session.set('adminError', null)
      Session.set('admin_title', null)
      Session.set('admin_subtitle', null)
      Session.set('admin_collection_name', null)
      Session.set('admin_collection_page', null)
      Session.set('admin_id', null)
      Session.set('admin_doc', null)

      // "/" route
      Session.set('admin_title', context.params.collectionName)
      Session.set('admin_subtitle', 'Edit')
      Session.set('admin_collection_page', 'edit')
      Session.set('admin_collection_name', context.params.collectionName)
      if (context.params.collectionName === 'Users') {
        Session.set('admin_id', context.params._id)
      } else {
        Session.set('admin_id', null)
      }
    }
  ],
  triggersExit: [
    function (context) {
      BlazeLayout.render('fAdminLayout', {main: 'AdminLoading'})
      Session.set('admin_id', null)
    }
  ],
  action: function (params) {
    if (params.collectionName === 'Users') {
      BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardUsersEdit' })
    } else {
      BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardEdit' })
    }
  }
})
