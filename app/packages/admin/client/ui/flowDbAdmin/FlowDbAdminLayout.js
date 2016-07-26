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
import jQuery from 'meteor/jquery'

// The code below is originally written by Sachin 'sachinbhutani' (https://github.com/sachinbhutani)
// for the package flow-db-admin (https://github.com/sachinbhutani/flow-db-admin).
// It has been adjusted that it works fine together with Meteor 1.3 and React

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

Template.fAdminLayout.events({
  'click .btn-delete': function (e, t) {
    let _id = jQuery(e.target).attr('doc')
    if (Session.equals('admin_collection_name', 'Users')) {
      Session.set('admin_id', _id)
      Session.set('admin_doc', Meteor.users.findOne(_id))
    } else {
      Session.set('admin_id', parseID(_id))
      Session.set('admin_doc', global.window.adminCollectionObject(FlowRouter.getParam('collectionName')).findOne(parseID(_id)))
    }
    return false
  }
})

Template.AdminDashboardUsersEdit.events({
  'click #confirm-delete': function () {
    let collection = FlowRouter.getParam('collectionName')
    let _id = FlowRouter.getParam('_id')
    Meteor.call('adminRemoveMongoDoc', collection, _id, function (e, r) {
      jQuery('#admin-delete-modal').modal('hide')
      jQuery('body').removeClass('modal-open')
      jQuery('.modal-backdrop').remove()
    })
    return false
  }
})

Template.AdminDashboardEdit.events({
  'click #confirm-delete': function () {
    let collection = FlowRouter.getParam('collectionName')
    let _id = FlowRouter.getParam('_id')
    Meteor.call('adminRemoveMongoDoc', collection, _id, function (e, r) {
      jQuery('#admin-delete-modal').modal('hide')
      jQuery('body').removeClass('modal-open')
      jQuery('.modal-backdrop').remove()
    })
    return false
  }
})

Template.AdminDashboardEdit.helpers({
  fadmin_doc: function () {
    let editcollectionName = FlowRouter.getParam('collectionName')
    let editId	= FlowRouter.getParam('_id')
    console.log('editcollectionName=' + editcollectionName)
    console.log('editId=' + editId)
    if (Meteor.isClient) {
      return global.window[ editcollectionName ].findOne({ '_id': editId })
    } else {
      return global[ editcollectionName ].findOne({ '_id': editId })
    }
  },
  action: function () {
    let action = FlowRouter.getQueryParam('action')
    console.log('action=' + action)
    return action
  }
})

Template.AdminDashboardUsersEdit.helpers({
  user: function () {
    return Meteor.users.findOne({ '_id': FlowRouter.getParam('_id') })
  },
  action: function () {
    let action = FlowRouter.getQueryParam('action')
    console.log('action=' + action)
    return action
  },
  roles: function () {
    return Roles.getRolesForUser(FlowRouter.getParam('_id'))
  },
  otherRoles: function () {
    _difference(_map(Meteor.roles.find().fetch(), function (role) { return role.name }), Roles.getRolesForUser(FlowRouter.getParam('_id')))
  }
})

function onPropsChange (props, onData) {
  let rerender = uuid.v4()
  let handle = Meteor.subscribe('adminUsers')
  let handle2 = Meteor.subscribe('adminUser')
  let handle3 = Meteor.subscribe('adminCollectionsCount')

  Session.set('adminSuccess', null)
  Session.set('adminError', null)

  switch (props.content) {
    case 'AdminDashboard':
      console.log('Render prep> ' + props.content)
      Session.set('admin_title', 'Dashboard')
      Session.set('admin_subtitle', null)
      Session.set('admin_collection_name', null)
      Session.set('admin_collection_page', null)
      Session.set('admin_id', null)
      break
    case 'AdminDashboardView':
      console.log('Render prep> ' + props.content + ' with collection=' + props.params.collectionName)
      Session.set('admin_title', props.params.collectionName)
      Session.set('admin_subtitle', 'View')
      Session.set('admin_collection_page', 'view')
      Session.set('admin_collection_name', props.params.collectionName)
      Session.set('admin_id', null)
      break
    case 'AdminDashboardUsersNew':
      console.log('Render prep> ' + props.content + ' with collection=' + props.params.collectionName)
      Session.set('admin_title', props.params.collectionName)
      Session.set('admin_subtitle', 'Create New')
      Session.set('admin_collection_page', 'new')
      Session.set('admin_collection_name', props.params.collectionName)
      Session.set('admin_id', null)
      break
    case 'AdminDashboardNew':
      console.log('Render prep> ' + props.content + ' with collection=' + props.params.collectionName)
      Session.set('admin_title', props.params.collectionName)
      Session.set('admin_subtitle', 'Create New')
      Session.set('admin_collection_page', 'new')
      Session.set('admin_collection_name', props.params.collectionName)
      Session.set('admin_id', null)
      break
    case 'AdminDashboardUsersEdit':
      console.log('Render prep> ' + props.content + ' with collection=' + props.params.collectionName)
      Session.set('admin_title', props.params.collectionName)
      Session.set('admin_subtitle', 'Edit')
      Session.set('admin_collection_page', 'edit')
      Session.set('admin_collection_name', props.params.collectionName)
      Session.set('admin_id', props.params._id)
      break
    case 'AdminDashboardEdit':
      console.log('Render prep> ' + props.content + ' with collection=' + props.params.collectionName)
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
    console.log('Subscribing handle4> ' + props.content + ' with collection=' + props.params.collectionName)
    handle4 = Meteor.subscribe('adminCollectionDoc', props.params.collectionName, parseID(props.params._id))
  }

  let handle5
  if (props.content === 'AdminDashboardUsersEdit' && props.params && props.params.collectionName === 'Users') {
    console.log('Subscribing handle5> ' + props.content + ' with collection=' + props.params.collectionName)
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
      console.log(item)
      Session.set('admin_doc', item)
      if (Session.get('admin_doc') && Session.get('admin_doc')._id === props.params._id) {
        console.log('onData (1)')
        onData(null, {rerender})
      }
    } else if (adminDoc._id === props.params._id) {
      console.log('onData (2)')
      onData(null, {rerender})
    } else {
      let item = global.window[props.params.collectionName].findOne({'_id': props.params._id})
      Session.set('admin_doc', item)
      if (Session.get('admin_doc') && Session.get('admin_doc')._id === props.params._id) {
        console.log('onData (3)')
        onData(null, {rerender})
      } else {
        console.log('no onData')
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
    console.log('Rendering> Receiving new props')
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
        console.log('Rendering> ' + props.content)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboard' })
        break
      case 'AdminDashboardView':
        console.log('Rendering> ' + props.content + ' with collection=' + props.params.collectionName)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardView' })
        break
      case 'AdminDashboardUsersNew':
        console.log('Rendering> ' + props.content + ' with collection=' + props.params.collectionName)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardUsersNew' })
        break
      case 'AdminDashboardNew':
        console.log('Rendering> ' + props.content + ' with collection=' + props.params.collectionName)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardNew' })
        break
      case 'AdminDashboardUsersEdit':
        console.log('Rendering> ' + props.content + ' with collection=' + props.params.collectionName)
        BlazeLayout.render('fAdminLayout', { main: 'AdminDashboardUsersEdit' })
        break
      case 'AdminDashboardEdit':
        console.log('Rendering> ' + props.content + ' with collection=' + props.params.collectionName)
        let adminDoc = Session.get('admin_doc')
        console.log(adminDoc)
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

FlowDbAdminLayout.propTypes = {
  content: React.PropTypes.object
}

export default composeWithTracker(onPropsChange)(FlowDbAdminLayout)
