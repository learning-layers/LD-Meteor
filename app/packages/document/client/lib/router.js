import React from 'react'
import { mount } from 'react-mounter'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import MainLayout from '../../../../common/client/ui/mainLayout/MainLayout'
import Navbar from '../../../../common/client/ui/mainLayout/Navbar'
import DocumentList from '../ui/DocumentList'
import Document from '../ui/Document'
import ShareDocumentAfterRequest from '../ui/sharing/ShareDocumentAfterRequest'
import HelpCenter from '../../../helpCenter/client/ui/HelpCenter'

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

let helpTours = [
  {
    label: 'Creating a document',
    hopscotchConfig: {
      id: 'create-document',
      steps: [
        {
          title: 'Create a document',
          content: 'To create a document click the dropdown menu here in the top navigation bar. After that choose the option \'New Document\' and the modal guides you to create a new document.',
          target: '#create-document-dropdown',
          placement: 'right'
        }
      ]
    }
  },
  {
    label: 'Sharing a document',
    hopscotchConfig: {
      id: 'share-document',
      steps: [
        {
          title: 'Share a document',
          content: 'To share a document open the sharing window via a click on this button.',
          target: '.open-sharing-modal-button',
          placement: 'left'
        }
      ]
    }
  },
  {
    label: 'Upload or download an attachment',
    hopscotchConfig: {
      id: 'document-attachments',
      steps: [
        {
          title: 'Attach a file to a document',
          content: 'To attach a file on a document click this button to switch the view to the attachments tab.',
          target: '.files-tab-btn',
          placement: 'right'
        }
      ]
    }
  },
  {
    label: 'Add a tag to a document',
    hopscotchConfig: {
      id: 'document-add-tag',
      steps: [
        {
          title: 'Add a tag to a document',
          content: 'To add a tag to a document enter the tagname you want to add here and press \'enter\' on your keyboard or choose an already existing tag from the suggestion list.',
          target: '.tag-bar',
          placement: 'bottom'
        }
      ]
    }
  },
  {
    label: 'Create a comment',
    hopscotchConfig: {
      id: 'document-create-comment',
      steps: [
        {
          title: 'Create a new comment in a document',
          content: 'To add a new comment fill out the comment box here. If you want to notifiy someone about your comment and want to send them a notification then via typing @<user-name> (at least 4 letters are necessary) you can send them a notification.',
          target: '.create-new-comment-wrapper',
          placement: 'top'
        },
        {
          title: 'Submit the new comment',
          content: 'To submit the new comment click on the \'submit\' button otherwise on the \'Cancel\' button.',
          target: '.create-new-comment-wrapper .btn.btn-sm.btn-default',
          placement: 'left'
        }
      ]
    }
  }
]

FlowRouter.route('/document/:id', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    let id = params.id
    let action = queryParams.action
    let permission = queryParams.permission
    let accessKey = queryParams.accessKey
    let isPublic = false
    if (action === 'shared' && permission === 'view' && accessKey) {
      isPublic = true
    }
    mount(MainLayout, {
      id: id,
      isPublic: isPublic,
      header: <Navbar />,
      content: <Document id={id} action={action} permission={permission} accessKey={accessKey} />,
      helpCenter: <HelpCenter helpTours={helpTours} />
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
