import React, {Component} from 'react'
import IFrameWithOnLoad from './IframeWithOnLoad'
import { Meteor } from 'meteor/meteor'
import Cookies from 'cookies-js'

const etherpadEndpoint = Meteor.settings.public.etherpad.endpoint

class EtherpadEditorWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cookieSet: false
    }
  }
  componentDidMount () {
    let closingCode = function closingCode () {
      let result = this.removeEtherpadCookie()
      console.log(result)
      return null
    }.bind(this)
    window.onbeforeunload = closingCode
    window.onunload = closingCode
    Meteor.call('getEtherpadSession', this.props.documentId, (err, res) => {
      if (err) {
        console.error('err=' + JSON.stringify(err))
      }
      if (res) {
        console.debug('res=' + JSON.stringify(res))
        Cookies.set('sessionID', res, { domain: 'localhost' })
        this.setState({
          cookieSet: true
        })
      }
    })
  }
  removeEtherpadCookie () {
    Cookies.expire('sessionID', { domain: 'localhost' })
    return true
  }
  componentWillUnmount () {
    this.removeEtherpadCookie()
  }
  onIframeLoaded () {
    console.debug('IFrame loaded')
  }
  render () {
    const { etherpadGroupPad } = this.props
    let etherpadPadUrl = etherpadEndpoint + '/p/' + etherpadGroupPad
    return <div className='etherpad-editor-wrapper'>
      {this.state.cookieSet ? <IFrameWithOnLoad id='etherpadEditorIframe' name='etherpadEditor' src={etherpadPadUrl} scrolling='no' onLoaded={this.onIframeLoaded} seamless /> : null}
    </div>
  }
}

export default EtherpadEditorWrapper
