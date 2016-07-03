import React, { Component } from 'react'
import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import {composeWithTracker} from 'react-komposer'
import { Mongo } from 'meteor/mongo'
import uuid from 'node-uuid'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import { Template } from 'meteor/templating'
import _difference from 'lodash/difference'
import _map from 'lodash/map'
// import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
// import { Template } from 'meteor/templating'

// The code below is originally written by Sachin 'sachinbhutani' (https://github.com/sachinbhutani)
// for the package flow-db-admin (https://github.com/sachinbhutani/flow-db-admin).
// It has been adjusted that it works fine together with Meteor 1.3 and React

global.window.adminCollectionObject = function (collection) {
  console.info('Expected=' + Session.get('admin_collection_name'))
  console.info('Observed=' + collection)
  if (collection === undefined) {
    collection = Session.get('admin_collection_name')
  }
  return global.window[collection]
}

Template.AdminDashboardEdit.helpers({
  fadmin_doc: function () {
    let editcollectionName = FlowRouter.getParam('collectionName')
    let editId	= FlowRouter.getParam('_id')
    console.debug('editcollectionName=' + editcollectionName)
    console.debug('editId=' + editId)
    return global.window[editcollectionName].findOne({'_id': editId})
  },
  action: function () {
    let action = FlowRouter.getQueryParam('action')
    console.debug('action=' + action)
    return action
  }
})

Template.AdminDashboardUsersEdit.helpers({
  user: function () {
    return Meteor.users.findOne({ '_id': FlowRouter.getParam('_id') })
  },
  action: function () {
    let action = FlowRouter.getQueryParam('action')
    console.debug('action=' + action)
    return action
  },
  roles: function () {
    return Roles.getRolesForUser(FlowRouter.getParam('_id'))
  },
  otherRoles: function () {
    _difference(_map(Meteor.roles.find().fetch(), function (role) { return role.name }), Roles.getRolesForUser(FlowRouter.getParam('_id')))
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

function onPropsChange (props, onData) {
  let rerender = uuid.v4()
  let handle = Meteor.subscribe('adminUsers')
  let handle2 = Meteor.subscribe('adminUser')
  let handle3 = Meteor.subscribe('adminCollectionsCount')

  Session.set('adminSuccess', null)
  Session.set('adminError', null)

  switch (props.content) {
    case 'AdminDashboard':
      console.debug('Render prep> ' + props.content)
      Session.set('admin_title', 'Dashboard')
      Session.set('admin_subtitle', null)
      Session.set('admin_collection_name', null)
      Session.set('admin_collection_page', null)
      Session.set('admin_id', null)
      break
    case 'AdminDashboardView':
      console.debug('Render prep> ' + props.content + ' with collection=' + props.params.collectionName)
      Session.set('admin_title', props.params.collectionName)
      Session.set('admin_subtitle', 'View')
      Session.set('admin_collection_page', 'view')
      Session.set('admin_collection_name', props.params.collectionName)
      Session.set('admin_id', null)
      break
    case 'AdminDashboardUsersNew':
      console.debug('Render prep> ' + props.content + ' with collection=' + props.params.collectionName)
      Session.set('admin_title', props.params.collectionName)
      Session.set('admin_subtitle', 'Create New')
      Session.set('admin_collection_page', 'new')
      Session.set('admin_collection_name', props.params.collectionName)
      Session.set('admin_id', null)
      break
    case 'AdminDashboardNew':
      console.debug('Render prep> ' + props.content + ' with collection=' + props.params.collectionName)
      Session.set('admin_title', props.params.collectionName)
      Session.set('admin_subtitle', 'Create New')
      Session.set('admin_collection_page', 'new')
      Session.set('admin_collection_name', props.params.collectionName)
      Session.set('admin_id', null)
      break
    case 'AdminDashboardUsersEdit':
      console.debug('Render prep> ' + props.content + ' with collection=' + props.params.collectionName)
      Session.set('admin_title', props.params.collectionName)
      Session.set('admin_subtitle', 'Edit')
      Session.set('admin_collection_page', 'edit')
      Session.set('admin_collection_name', props.params.collectionName)
      Session.set('admin_id', props.params._id)
      break
    case 'AdminDashboardEdit':
      console.debug('Render prep> ' + props.content + ' with collection=' + props.params.collectionName)
      Session.set('admin_title', props.params.collectionName)
      Session.set('admin_subtitle', 'Edit')
      Session.set('admin_collection_page', 'edit')
      Session.set('admin_collection_name', props.params.collectionName)
      Session.set('admin_id', null)
      break
    default:
      break
  }

  let adminDoc = Session.get('admin_doc')
  let adminId = Session.get('admin_id')

  let handle4
  if (props.content === 'AdminDashboardEdit' && props.params && props.params.collectionName !== 'Users') {
    console.debug('Subscribing handle4> ' + props.content + ' with collection=' + props.params.collectionName)
    handle4 = Meteor.subscribe('adminCollectionDoc', props.params.collectionName, parseID(props.params._id))
  }

  let handle5
  if (props.content === 'AdminDashboardUsersEdit' && props.params && props.params.collectionName === 'Users') {
    console.debug('Subscribing handle5> ' + props.content + ' with collection=' + props.params.collectionName)
    handle5 = Meteor.subscribe('userprofile', {userId: parseID(props.params._id)})
  }

  if (props.content !== 'AdminDashboardEdit' && props.content !== 'AdminDashboardUsersEdit' && handle.ready() && handle2.ready() && handle3.ready()) {
    if (adminDoc !== null) {
      Session.set('admin_doc', null)
    } else {
      onData(null, {rerender})
    }
  } else if (props.content === 'AdminDashboardEdit' && handle.ready() && handle2.ready() && handle3.ready() && handle4.ready()) {
    if (!adminDoc || adminDoc === null) {
      let item = global.window[props.params.collectionName].findOne({'_id': props.params._id})
      console.debug(item)
      Session.set('admin_doc', item)
      if (Session.get('admin_doc') && Session.get('admin_doc')._id === props.params._id) {
        console.debug('onData (1)')
        onData(null, {rerender})
      }
    } else if (adminDoc._id === props.params._id) {
      console.debug('onData (2)')
      onData(null, {rerender})
    } else {
      let item = global.window[props.params.collectionName].findOne({'_id': props.params._id})
      Session.set('admin_doc', item)
      if (Session.get('admin_doc') && Session.get('admin_doc')._id === props.params._id) {
        console.debug('onData (3)')
        onData(null, {rerender})
      } else {
        console.debug('no onData')
      }
    }
  } else if (props.content === 'AdminDashboardUsersEdit' && handle.ready() && handle2.ready() && handle3.ready() && handle5.ready()) {
    if (!adminId || adminId === null) {
      Session.set('admin_id', props.params._id)
      if (Session.get('admin_id') === props.params._id) {
        onData(null, {rerender})
      }
    } else {
      onData(null, {rerender})
    }
  }
}

class FlowDbAdminLayout extends Component {
  componentDidMount () {
    this.mountComponents(this.props)
  }
  componentWillReceiveProps (nextProps) {
    console.debug('Rendering> Receiving new props')
    this.props = nextProps
    BlazeLayout.render('fAdminLayout', {main: 'AdminLoading'})
    this.mountComponents(nextProps)
  }
  mountComponents (props) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Meteor.call('adminCheckAdmin')
      // if (typeof AdminConfig.nonAdminRedirectRoute == 'string')
      //	FlowRouter.go(AdminController.nonAdminRedirectRoute);
    }
    switch (props.content) {
      case 'AdminDashboard':
        console.debug('Rendering> ' + props.content)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboard' })
        break
      case 'AdminDashboardView':
        console.debug('Rendering> ' + props.content + ' with collection=' + props.params.collectionName)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardView' })
        break
      case 'AdminDashboardUsersNew':
        console.debug('Rendering> ' + props.content + ' with collection=' + props.params.collectionName)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardUsersNew' })
        break
      case 'AdminDashboardNew':
        console.debug('Rendering> ' + props.content + ' with collection=' + props.params.collectionName)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardNew' })
        break
      case 'AdminDashboardUsersEdit':
        console.debug('Rendering> ' + props.content + ' with collection=' + props.params.collectionName)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardUsersEdit' })
        break
      case 'AdminDashboardEdit':
        console.debug('Rendering> ' + props.content + ' with collection=' + props.params.collectionName)
        let adminDoc = Session.get('admin_doc')
        console.debug(adminDoc)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardEdit' })
        break
      default:
        break
    }
  }
  render () {
    return <div>
      {this.props.content}
      <div id='fAdminLayout' ref='fAdminLayout' style={{visibility: 'hidden', height: '0px', width: '0px'}}>
      </div>
    </div>
  }
}

export default composeWithTracker(onPropsChange)(FlowDbAdminLayout)

/* Template.AdminDashboardEdit.rendered = function () {
  let editcollectionName = FlowRouter.getParam('collectionName')
  let editId = FlowRouter.getParam('_id')
  let item = global.window[editcollectionName].findOne({'_id': editId})
  console.debug(item)
  if (Session.get('admin_doc') && item && Session.get('admin_doc')._id !== item._id) {
    console.debug('Item id is different (2)')
    Session.set('admin_doc', item)
    Meteor.setTimeout(() => {
      BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardEdit' })
    }, 300)
  } else if (!Session.get('admin_doc')) {
    console.debug('Admin doc not set (2)')
    Session.set('admin_doc', item)
    Meteor.setTimeout(() => {
      BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardEdit' })
    }, 300)
  } else if (Session.get('admin_doc') && !item) {
    console.debug('Item not available (2)')
    Meteor.setTimeout(() => {
      BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardEdit' })
    }, 300)
  } else if (Session.get('admin_doc') && item && Session.get('admin_doc')._id === item._id) {
    console.debug('Already the right item fetched (2)')
    Meteor.setTimeout(() => {
      BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardEdit' })
    }, 300)
  }
}*/
