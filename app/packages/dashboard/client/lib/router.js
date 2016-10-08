import React from 'react'
import { mount } from 'react-mounter'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import MainLayout from '../../../../common/client/ui/mainLayout/MainLayout'
import Navbar from '../../../../common/client/ui/mainLayout/Navbar'
import Dashboard from '../ui/Dashboard'
import HelpCenter from '../../../helpCenter/client/ui/HelpCenter'

FlowRouter.route('/dashboard', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    mount(MainLayout, {
      header: <Navbar />,
      content: <Dashboard />,
      helpCenter: null
    })
  }
})

let helpTours = [
  {
    label: 'Find your documents',
    hopscotchConfig: {
      id: 'hello-hopscotch',
      steps: [
        {
          title: 'Finding your documents',
          content: 'To find your documents you can currently use three ways indicated by these tabs above. This first tab allows you to search for documents via entering the document title in a search box.',
          target: '#dashboard-controlled-tab .glyphicon.glyphicon-search',
          placement: 'bottom'
        },
        {
          title: 'The search input field',
          content: 'Here you can enter the title or parts of the title of the document you want to find. While typing you already get results shown and can stop if you found the document you were looking for.',
          target: '.document-list input',
          placement: 'bottom'
        },
        {
          title: 'Find by active contacts currently working on a document',
          content: 'Activate this tab please. This tab shows the documents that your contacts currently work on. Contacts are users that are either in your friendlist or in a group were you are also a member.',
          target: '#dashboard-controlled-tab .fa.fa-users',
          placement: 'bottom'
        },
        {
          title: 'History',
          content: 'Another way to find your documents is to search in the list of documents you have recently visited. By clicking this tab you can get a list of your recently visited documents.',
          target: '#dashboard-controlled-tab .glyphicon.glyphicon-time',
          placement: 'bottom'
        }
      ]
    }
  }
]

FlowRouter.route('/home', {
  action: function (params, queryParams) {
    console.log('Params:', params)
    console.log('Query Params:', queryParams)
    mount(MainLayout, {
      header: <Navbar />,
      content: <Dashboard />,
      helpCenter: <HelpCenter helpTours={helpTours} />
    })
  }
})
