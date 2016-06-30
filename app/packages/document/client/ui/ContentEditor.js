import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import IFrameWithOnLoad from './IframeWithOnLoad'

const etherpadEndpoint = Meteor.settings.public.etherpad.endpoint

class ContentEditor extends Component {
  onIframeLoaded () {
    window.alert('IFrame loaded')
  }
  render () {
    const { document } = this.props
    let etherpadGroup = document.etherpadGroup
    let etherpadGroupPad = document.etherpadGroupPad
    if (!etherpadGroup) {
      // send a request to the server that the server should create a group and a pad in etherpad
      Meteor.call('createEtherpadGroupAndPad', document._id)
    }

    let etherpadPadUrl = etherpadEndpoint + '/p/' + etherpadGroupPad
    return <div id='content-editor'>
      {etherpadGroup ? <div>{etherpadGroupPad ? 'etherpad exists (2/2)' : 'etherpad exists (1/2)'}</div> : 'etherpad doesn\'t exist (0/2)'}
      {etherpadGroupPad ? <IFrameWithOnLoad id='etherpadEditorIframe' name='etherpadEditor' src={etherpadPadUrl} scrolling='no' onLoaded={this.onIframeLoaded} seamless /> : null}
    </div>
  }
}

export default ContentEditor
