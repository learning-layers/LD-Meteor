import React from 'react'
import { mount } from 'react-mounter'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import MainLayout from '../../../../common/client/ui/mainLayout/MainLayout'
import Navbar from '../../../../common/client/ui/mainLayout/Navbar'
import DocumentList from '../ui/DocumentList'
import Document from '../ui/Document'
import ShareDocumentAfterRequest from '../ui/sharing/ShareDocumentAfterRequest'

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

FlowRouter.route('/document/:id', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    let id = params.id
    let action = queryParams.action
    let permission = queryParams.permission
    let accessKey = queryParams.accessKey
    let isPublic = false
    if (action && permission && accessKey) {
      isPublic = true
    }
    mount(MainLayout, {
      id: id,
      isPublic: isPublic,
      header: <Navbar />,
      content: <Document id={id} action={action} permission={permission} accessKey={accessKey} />,
      helpCenter: null
    })
  }
})

FlowRouter.route('/request-document-access/:token', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    let token = params.token
    mount(MainLayout, {
      header: <Navbar />,
      content: <ShareDocumentAfterRequest token={token} />,
      helpCenter: null
    })
  }
})
