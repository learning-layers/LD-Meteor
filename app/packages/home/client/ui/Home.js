import React, { Component } from 'react'
import { compose } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import { Tracker } from 'meteor/tracker'

function getTrackerLoader (reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env)
      })
    })

    return () => {
      if (typeof trackerCleanup === 'function') trackerCleanup()
      return handler.stop()
    }
  }
}

function onPropsChange (props, onData) {
  const userId = Meteor.userId()
  onData(null, {userId})
}

class Home extends Component {
  componentDidMount () {
    if (this.props.userId) {
      FlowRouter.go('/home')
    }
    this.checkIfLoggedIn = setInterval(() => {
      if (this.props.userId) {
        FlowRouter.go('/home')
      }
    }, 1000)
  }
  componentWillUnmount () {
    clearInterval(this.checkIfLoggedIn)
  }
  render () {
    return (
      <div className='ld-home container-fluid'>
        <h2 className='letterpress-effect'>Living Documents</h2>
      </div>
    )
  }
}

export default compose(getTrackerLoader(onPropsChange))(Home)
