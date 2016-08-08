import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import React from 'react'
import { mount } from 'react-mounter'
import MainLayout from '../ui/mainLayout/MainLayout'
import Navbar from '../ui/mainLayout/Navbar'
import NotFound from '../ui/mainLayout/NotFound'

FlowRouter.notFound = {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    let id = params.id
    let accessKey = params.accessKey
    // TODO check if the path contains the keyword share if so change the message
    mount(MainLayout, {
      isPublic: true,
      id: id,
      accessKey: accessKey,
      header: <Navbar />,
      content: <NotFound />,
      helpCenter: null
    })
  }
}
