import React from 'react'
import { mount } from 'react-mounter'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import MainLayout from '../../../../common/both/ui/mainLayout/MainLayout'
import Navbar from '../../../../common/both/ui/mainLayout/Navbar'
import UserProfile from '../ui/UserProfile'

FlowRouter.route('/user/:id', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    mount(MainLayout, {
      header: <Navbar />,
      content: <UserProfile userId={params.id} />,
      helpCenter: null
    })
  }
})
