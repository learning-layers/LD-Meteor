import React, {Component} from 'react'
import ReactDom from 'react-dom'
import { Meteor } from 'meteor/meteor'

/* <li>
 Can edit&nbsp;
 {documentAccess && documentAccess.linkCanEdit ? documentAccess.linkCanEdit.linkId : <button className='btn btn-default gen-can-edit-link-btn' onClick={() => this.generateSharingLink('CanEdit')}>
 Generate Edit Link
 </button>}
 </li>
 <li>
 Can comment&nbsp;
 {documentAccess && documentAccess.linkCanComment ? documentAccess.linkCanComment.linkId : <button className='btn btn-default gen-can-comment-link-btn' onClick={() => this.generateSharingLink('CanComment')}>
 Generate Comment Link
 </button>}
 </li> */

export class DocumentLinkSharing extends Component {
  generateSharingLink (permission) {
    Meteor.call('generateDocumentSharingLink', this.props.documentId, permission)
  }
  copyToClipboard (permission) {
    ReactDom.findDOMNode(this.refs[permission + 'Link']).select()
    try {
      var successful = document.execCommand('copy')
      var msg = successful ? 'successful' : 'unsuccessful'
      window.alert('Copying text command was ' + msg)
    } catch (err) {
      window.alert('Oops, unable to copy')
    }
  }
  render () {
    const { documentAccess } = this.props
    return <div className='document-link-sharing'>
      DocumentLinkSharing
      <ul>
        <li>
          Can view&nbsp;
          {documentAccess && documentAccess.linkCanView ? <div>
            <input ref='viewLink' type='text' value={Meteor.absoluteUrl() + '/document/' + this.props.documentId + '?action=shared&permission=view&accessKey=' + documentAccess.linkCanView.linkId} />
            <button className='btn btn-link' onClick={() => this.copyToClipboard('view')}>Copy to clipboard</button>
          </div> : <button className='btn btn-default gen-can-view-link-btn' onClick={() => this.generateSharingLink('CanView')}>
            Generate View Link
          </button>}
        </li>
      </ul>
    </div>
  }
}
