import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Tracker } from 'meteor/tracker'

function onPropsChange (props, onData) {
  let status = {
    connected: true
  }
  if (Meteor.isClient) {
    status = Meteor.status()
  }
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
    this.trackerHandle = Tracker.autorun(() => {
      let status = Meteor.status()
      if (status.connected) {
        Meteor.call('getServerTimeLD', {clientTime: new Date()}, (error, result) => {
          if (!error) {
            this.setState({
              roundTripTime: Math.abs(Date.now() - result),
              offline: false
            })
          }
        })
      } else {
        this.setState({
          roundTripTime: '',
          offline: true
        })
      }
    })
    this.rttInterval = setInterval(() => {
      if (this.props.status.connected) {
        Meteor.call('getServerTimeLD', {clientTime: new Date()}, (error, result) => {
          if (!error) {
            this.setState({
              roundTripTime: Math.abs(Date.now() - result),
              offline: false
            })
          }
        })
      } else {
        this.setState({
          roundTripTime: '',
          offline: true
        })
      }
    }, 10001)
  }
  componentWillUnmount () {
    if (this.rttInterval) {
      clearInterval(this.rttInterval)
    }
    if (this.trackerHandle) {
      this.trackerHandle.stop()
    }
  }
  render () {
    const { status } = this.props
    return <div className='rtt-display' style={{position: 'absolute', top: '40px', opacity: 0.7, fontSize: '11px'}}>
      {status.connected ? <span>
        {this.state.roundTripTime !== '' ? <span>
          <div style={{display: 'inline-block', marginRight: '3px', fontSize: '13px'}}>
            <span className='glyphicon glyphicon-flash' />
          </div>
          <div style={{
            boxShadow: 'rgb(0, 0, 0) 0px -1px, rgb(0, 0, 0) 0px -1px 1px, rgba(83, 255, 139, 0.34902) 0px 0px 4px 2px',
            opacity: 1,
            flex: '1 0 auto',
            height: '10px',
            borderRadius: '4px',
            transition: 'all 0.25s',
            margin: '3px 1px 0px',
            backgroundColor: 'rgb(53, 231, 109)',
            width: '15px',
            display: 'inline-block',
            marginRight: '5px'
          }}></div>
          <div style={{display: 'inline-block'}}>{this.state.roundTripTime} ms</div>
        </span> : <span>
          <div style={{display: 'inline-block', marginRight: '3px', fontSize: '13px'}}>
            <span className='glyphicon glyphicon-flash' />
          </div>
          <div style={{
            boxShadow: 'rgb(0, 0, 0) 0px -1px, rgb(0, 0, 0) 0px -1px 1px, rgba(255, 255, 51, 0.34902) 0px 0px 4px 2px',
            opacity: 1,
            flex: '1 0 auto',
            height: '10px',
            borderRadius: '4px',
            transition: 'all 0.25s',
            margin: '3px 1px 0px',
            backgroundColor: 'rgb(231, 231, 51)',
            width: '15px',
            display: 'inline-block',
            marginRight: '5px'
          }}></div>
          <div style={{display: 'inline-block'}}>Connecting...</div>
        </span>}
      </span> : <span>
        <div style={{display: 'inline-block', marginRight: '3px', fontSize: '13px'}}>
          <span className='glyphicon glyphicon-flash' />
        </div>
        <div style={{
          boxShadow: 'rgb(0, 0, 0) 0px -1px, rgb(0, 0, 0) 0px -1px 1px, rgba(83, 255, 139, 0.34902) 0px 0px 4px 2px',
          opacity: 1,
          flex: '1 0 auto',
          height: '10px',
          borderRadius: '4px',
          transition: 'all 0.25s',
          margin: '3px 1px 0px',
          backgroundColor: 'rgb(249, 39, 39)',
          width: '15px',
          display: 'inline-block',
          marginRight: '5px'
        }}></div>
        <div style={{display: 'inline-block'}}>Offline</div>
      </span>}
    </div>
  }
}

RoundTripTimeDisplay.propTypes = {
  status: React.PropTypes.object
}

export default composeWithTracker(onPropsChange)(RoundTripTimeDisplay)
