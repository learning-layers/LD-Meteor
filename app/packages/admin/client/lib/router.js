import React from 'react'
import { mount } from 'react-mounter'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import MainLayout from '../../../../common/client/ui/mainLayout/MainLayout'
import Navbar from '../../../../common/client/ui/mainLayout/Navbar'
import Admin from '../ui/Admin'
import UserManagement from '../ui/UserManagement'
import HelpVideoUpload from '../ui/HelpVideoUpload'

FlowRouter.route('/ldadmin', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    mount(MainLayout, {
      header: <Navbar />,
      content: <Admin />,
      helpCenter: null
    })
  }
})

FlowRouter.route('/userManagement', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    mount(MainLayout, {
      header: <Navbar />,
      content: <UserManagement />,
      helpCenter: null
    })
  }
})

FlowRouter.route('/helpVideoUpload', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    mount(MainLayout, {
      header: <Navbar />,
      content: <HelpVideoUpload />,
      helpCenter: null
    })
  }
})
