import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import { mount } from 'react-mounter'
import FlowDbAdminLayout from '../ui/flowDbAdmin/FlowDbAdminLayout'

// The code below is originally written by Sachin 'sachinbhutani' (https://github.com/sachinbhutani)
// for the package flow-db-admin (https://github.com/sachinbhutani/flow-db-admin).
// It has been adjusted that it works fine together with Meteor 1.3 and React

FlowRouter.route('/admin', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    mount(FlowDbAdminLayout, {
      content: 'AdminDashboard'
    })
  }
})

FlowRouter.route('/admin/view/:collectionName', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    mount(FlowDbAdminLayout, {
      params: params,
      content: 'AdminDashboardView'
    })
  }
})

FlowRouter.route('/admin/new/:collectionName', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    if (params.collectionName === 'Users') {
      mount(FlowDbAdminLayout, {
        params: params,
        content: 'AdminDashboardUsersNew'
      })
    } else {
      mount(FlowDbAdminLayout, {
        params: params,
        content: 'AdminDashboardNew'
      })
    }
  }
})

FlowRouter.route('/admin/edit/:collectionName/:_id', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    if (params.collectionName === 'Users') {
      mount(FlowDbAdminLayout, {
        params: params,
        content: 'AdminDashboardUsersEdit'
      })
    } else {
      mount(FlowDbAdminLayout, {
        params: params,
        content: 'AdminDashboardEdit'
      })
    }
  }
})
