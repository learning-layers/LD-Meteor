import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import EtherpadEditorWrapper from './EtherpadEditorWrapper'

class ContentEditor extends Component {
  render () {
    const { document } = this.props
    let etherpadGroup = document.etherpadGroup
    let etherpadGroupPad = document.etherpadGroupPad
    if (!etherpadGroup) {
      // send a request to the server that the server should create a group and a pad in etherpad
      Meteor.call('createEtherpadGroupAndPad', document._id)
    }
    return <div id='content-editor'>
      {etherpadGroup ? <div>{etherpadGroupPad ? 'etherpad exists (2/2)' : 'etherpad exists (1/2)'}</div> : 'etherpad doesn\'t exist (0/2)'}
      {etherpadGroupPad ? <EtherpadEditorWrapper etherpadGroupPad={etherpadGroupPad} documentId={document._id} /> : null}
    </div>
  }
}

export default ContentEditor
