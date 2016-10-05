import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'

function onPropsChange (props, onData) {
  const user = Meteor.user()
  onData(null, {user})
}

class Home extends Component {
  componentDidMount () {
    this.checkIfLoggedIn = setInterval(function () {
      if (this.props.user) {
        FlowRouter.go('/home')
      }
    }, 1000)
  }
  componentWillUnmount () {
    clearInterval(this.checkIfLoggedIn)
  }
  render () {
    const { user } = this.props
    if (user) {
      FlowRouter.go('/home')
    }
    return (
      <div className='ld-home container-fluid'>
        <h2 className='letterpress-effect'>Living Documents</h2>
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(Home)
