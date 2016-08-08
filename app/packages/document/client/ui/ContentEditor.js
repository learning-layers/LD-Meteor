import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import EtherpadEditorWrapper from './EtherpadEditorWrapper'

class ContentEditor extends Component {
  componentDidMount () {
    const { document, permissionLevel } = this.props
    const etherpadGroup = document.etherpadGroup
    const etherpadReadOnlyId = document.etherpadReadOnlyId
    if (permissionLevel === 'edit' && !etherpadGroup) {
      // send a request to the server that the server should create a group and a pad in etherpad
      Meteor.call('createEtherpadGroupAndPad', document._id)
    } else if (permissionLevel === 'comment' || permissionLevel === 'view' && !etherpadReadOnlyId) {
      // send a request to the server that the server should create a group and a pad in etherpad
      // and create a read only id for the document as well
      Meteor.call('createEtherpadReadOnlyId', document._id)
    }
  }
  render () {
    const { document, permissionLevel } = this.props
    const etherpadGroup = document.etherpadGroup
    const etherpadGroupPad = document.etherpadGroupPad
    const etherpadReadOnlyId = document.etherpadReadOnlyId
    // 'etherpad exists (2/2)'
    return <div id='content-editor'>
      {etherpadGroup ? <div>{etherpadGroupPad ? null : 'etherpad exists (1/2)'}</div> : 'etherpad doesn\'t exist (0/2)'}
      {permissionLevel !== 'edit' && etherpadReadOnlyId ? <EtherpadEditorWrapper etherpadReadOnlyId={etherpadReadOnlyId} documentId={document._id} /> : null}
      {permissionLevel === 'edit' && etherpadGroupPad ? <EtherpadEditorWrapper etherpadGroupPad={etherpadGroupPad} documentId={document._id} /> : null}
    </div>
  }
}

ContentEditor.propTypes = {
  document: React.PropTypes.object,
  permissionLevel: React.PropTypes.string
}

export default ContentEditor
