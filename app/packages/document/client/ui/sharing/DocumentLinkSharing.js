import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'

export class DocumentLinkSharing extends Component {
  generateSharingLink (permission) {
    Meteor.call('generateDocumentSharingLink', this.props.documentId, permission)
  }
  render () {
    const { documentAccess } = this.props
    return <div className='document-link-sharing'>
      DocumentLinkSharing
      <ul>
        <li>
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
        </li>
        <li>
          Can view&nbsp;
          {documentAccess && documentAccess.linkCanView ? documentAccess.linkCanView.linkId : <button className='btn btn-default gen-can-view-link-btn' onClick={() => this.generateSharingLink('CanView')}>
            Generate View Link
          </button>}
        </li>
      </ul>
    </div>
  }
}
