import React from 'react'
import { mount } from 'react-mounter'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import MainLayout from '../../../../common/client/ui/mainLayout/MainLayout'
import Navbar from '../../../../common/client/ui/mainLayout/Navbar'
import DocumentList from '../ui/DocumentList'

FlowRouter.route('/documentList', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    mount(MainLayout, {
      header: <Navbar />,
      content: <DocumentList />,
      helpCenter: null
    })
  }
})

FlowRouter.route('/document/:id/shared/:accessKey', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    let id = params.id
    let accessKey = params.accessKey
    mount(MainLayout, {
      isPublic: true,
      accessKey: accessKey,
      id: id,
      header: <Navbar />,
      content: null,
      helpCenter: null
    })
  }
})
