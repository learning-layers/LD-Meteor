import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'

function onPropsChange (props, onData) {
  let status = Meteor.status()
  onData(null, {status})
}

class RoundTripTimeDisplay extends Component {
  constructor (props) {
    super(props)
    this.state = {
      roundTripTime: ''
    }
  }
  componentDidMount () {
    this.rttInterval = setInterval(() => {
      if (this.props.connected) {
        Meteor.call('getServerTimeLD', (error, result) => {
          if (!error) {
            this.setState({
              roundTripTime: Date.now() - result,
              offline: false
            })
          }
        })
      }
    }, 1001)
  }
  componentWillUnmount () {
    if (this.rttInterval) {
      clearInterval(this.rttInterval)
    }
  }
  render () {
    const { status } = this.props
    return <div className='rtt-display' style={{position: 'absolute', top: '40px', opacity: 0.7, fontSize: '11px'}}>
      {status.connected ? <span>
        {this.state.roundTripTime !== '' ? <span>last RTT: {this.state.roundTripTime} ms</span> : null}
      </span> : <span>Offline</span>}
    </div>
  }
}

export default composeWithTracker(onPropsChange)(RoundTripTimeDisplay)
