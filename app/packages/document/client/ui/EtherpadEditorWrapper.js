import React, {Component} from 'react'
import IFrameWithOnLoad from './IframeWithOnLoad'
import { Meteor } from 'meteor/meteor'
import Cookies from 'cookies-js'

const etherpadEndpoint = Meteor.settings.public.etherpad.endpoint

class EtherpadEditorWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cookieSet: false,
      cookieDomain: null
    }
    this.closingCode = function closingCode () {
      let result = this.removeEtherpadCookie()
      console.log(result)
      return null
    }.bind(this)
  }
  componentDidMount () {
    window.addEventListener('beforeunload', this.closingCode, false)
    window.addEventListener('unload', this.closingCode, false)
    Meteor.call('getEtherpadSession', this.props.documentId, (err, res) => {
      if (err) {
        console.error('err=' + JSON.stringify(err))
      }
      if (res) {
        console.log('res=' + JSON.stringify(res))
        let domain
        if (res.domain.indexOf(':') === -1) {
          domain = res.domain
        } else {
          domain = res.domain.split(':')[0]
        }
        Cookies.set('sessionID', res.sessionId, { domain: domain })
        this.setState({
          cookieSet: true,
          cookieDomain: domain
        })
      }
    })
  }
  removeEtherpadCookie () {
    if (this.state.cookieDomain) {
      Cookies.expire('sessionID', { domain: this.state.cookieDomain })
    }
    return true
  }
  componentWillUnmount () {
    this.removeEtherpadCookie()
    window.removeEventListener('beforeunload', this.closingCode, false)
    window.removeEventListener('unload', this.closingCode, false)
  }
  onIframeLoaded () {
    if (this.props.etherpadGroupPad) {
      console.log('IFrame loaded with etherpad writing access')
    } else {
      console.log('IFrame loaded with etherpad read only access')
    }
  }
  render () {
    const { etherpadGroupPad, etherpadReadOnlyId } = this.props
    let etherpadPadUrl
    if (etherpadGroupPad) {
      etherpadPadUrl = etherpadEndpoint + '/p/' + etherpadGroupPad
    } else {
      etherpadPadUrl = etherpadEndpoint + '/p/' + etherpadReadOnlyId
    }
    return <div className='etherpad-editor-wrapper'>
      {this.state.cookieSet ? <IFrameWithOnLoad id='etherpadEditorIframe' name='etherpadEditor' src={etherpadPadUrl} scrolling='no' onLoaded={() => this.onIframeLoaded()} seamless /> : null}
    </div>
  }
}

EtherpadEditorWrapper.propTypes = {
  documentId: React.PropTypes.string,
  etherpadGroupPad: React.PropTypes.string,
  etherpadReadOnlyId: React.PropTypes.string
}

export default EtherpadEditorWrapper
