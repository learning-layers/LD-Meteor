import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import { mount } from 'react-mounter'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'

class LoadingScreen extends Component {
  render () {
    return <div className='loading'>
      ::::::
    </div>
  }
}

if (Meteor.isServer) {
  FlowRouter.route('/:any', {
    action: function (params, queryParams) {
      console.log('Params:', params)
      console.log('Query Params:', queryParams)
      mount(LoadingScreen, {})
    }
  })
}
