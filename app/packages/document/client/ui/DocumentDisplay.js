import { Meteor } from 'meteor/meteor'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Breadcrumbs from './document/Breadcrumbs'
import TagBar from './document/TagBar'
import CommentingArea from './comment/CommentingArea'
import MainContentHeading from './document/MainContentHeading'
import MainContentBody from './document/MainContentBody'
import FullScreenEditorModal from './mainContent/contentEditor/FullScreenEditorModal'
import SubDocumentList from './SubDocumentList'
import { Groups } from '../../../groups/lib/collections'
import EventEmitterInstance from '../../../../common/client/EventEmitter'
import CreateDocumentModal from './CreateDocumentModal'

class DocumentDisplay extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showSubDocuments: false,
      openFullScreenEditorModal: null,
      openCreateDocumentModal: null
    }
  }
  componentDidMount () {
    Meteor.setTimeout(function () {
      global.tinymce.init({
        selector: '#tinymceTextarea',
        skin_url: '/packages/teamon_tinymce/skins/lightgray',
        plugins: 'print',
        content_security_policy: 'default-src \'self\''
      })
    }, 1000)
    this.createSubDocumentSubscription = EventEmitterInstance.addListener('open-create-sub-document-modal', (selection, parentId) => {
      this.openCreateSubDocumentModal(selection, parentId)
    })
    this.openShowSubdocumentsSubscription = EventEmitterInstance.addListener('doc-open-subdocs', (open) => {
      this.toggleShowSubdocuments(open)
    })
    this.toggleShowSubdocumentsSubscription = EventEmitterInstance.addListener('doc-toggle-subdocs', () => {
      this.toggleShowSubdocuments()
    })
  }
  componentWillUnmount () {
    let renderToElement = this.refs.openFullScreenEditorModal
    if (this.state.openFullScreenEditorModal !== null) {
      ReactDOM.unmountComponentAtNode(renderToElement)
    }
    Meteor.setTimeout(function () {
      global.tinymce.execCommand('mceRemoveControl', true, 'tinymceTextarea')
    }, 0)
    if (this.createSubDocumentSubscription) {
      this.createSubDocumentSubscription.remove()
    }
    if (this.toggleShowSubdocumentsSubscription) {
      this.toggleShowSubdocumentsSubscription.remove()
    }
    if (this.openShowSubdocumentsSubscription) {
      this.openShowSubdocumentsSubscription.remove()
    }
  }
  openCreateSubDocumentModal (selection, parentId) {
    let renderToElement = this.refs.createDocumentModal
    if (!this.state.openCreateDocumentModal) {
      this.state.openCreateDocumentModal = ReactDOM.render(<CreateDocumentModal selection={selection} parentId={parentId} />, renderToElement)
    } else {
      this.state.openCreateDocumentModal.open(selection, parentId)
    }
  }
  isViewMode () {
    return this.props.action && this.props.action === 'shared' && this.props.permission && this.props.permission === 'view' && this.props.accessKey
  }
  toggleShowSubdocuments (open) {
    if (open && !this.state.showSubDocuments) {
      this.setState({
        showSubDocuments: true
      })
    } else if (open === undefined) {
      this.setState({
        showSubDocuments: !this.state.showSubDocuments
      })
    }
  }
  openFullscreenEditorModal () {
    let renderToElement = this.refs.fullScreenEditorModal
    if (!this.state.openFullScreenEditorModal) {
      this.state.openFullScreenEditorModal = ReactDOM.render(<FullScreenEditorModal document={this.props.document} permissionLevel={this.getPermissionLevel(this.props.documentAccess)} />, renderToElement)
    } else {
      this.state.openFullScreenEditorModal.open(this.props.document, this.getPermissionLevel(this.props.documentAccess))
    }
  }
  getPermissionLevel (documentAccess) {
    if (this.props.document.createdBy === Meteor.userId()) {
      return 'edit'
    } else if (this.isViewMode()) {
      return 'view'
    } else if (documentAccess) {
      // TODO add groups access check
      if (documentAccess) {
        let permission
        documentAccess.userCanEdit.forEach(function (userPermissionItem) {
          if (userPermissionItem.userId === Meteor.userId()) {
            permission = 'edit'
          }
        })
        if (permission !== 'edit') {
          documentAccess.userCanComment.forEach(function (userPermissionItem) {
            if (userPermissionItem.userId === Meteor.userId()) {
              permission = 'comment'
            }
          })
          if (permission !== 'comment') {
            const userId = Meteor.userId()
            documentAccess.groupCanEdit.forEach(function (groupPermissionItem) {
              const group = Groups.find({_id: groupPermissionItem.groupId, 'members.userId': userId})
              if (group) {
                permission = 'edit'
              }
            })
            if (permission !== 'edit') {
              documentAccess.groupCanComment.forEach(function (groupPermissionItem) {
                const group = Groups.find({_id: groupPermissionItem.groupId, 'members.userId': userId})
                if (group) {
                  permission = 'comment'
                }
              })
            }
            if (permission !== 'edit' && permission !== 'comment') {
              documentAccess.groupCanView.forEach(function (groupPermissionItem) {
                const group = Groups.find({_id: groupPermissionItem.groupId, 'members.userId': userId})
                if (group) {
                  permission = 'view'
                }
              })
            }
            if (!permission) {
              return 'view'
            }
          }
        }
        return permission
      } else {
        return 'view'
      }
    } else {
      console.error('Couldn\'t detect document permissions')
      return 'view'
    }
  }
  render () {
    const { document, documentAccess } = this.props
    const isViewMode = this.isViewMode()
    let mainContentClasses = 'main-content panel panel-primary'
    if (this.state.showSubDocuments) {
      mainContentClasses += ' show-sub-docs'
    }
    return (
      <div className='document container-fluid'>
        <div className='well breadcrumb-tag-wrapper'>
          <Breadcrumbs isSubdocument={document.isSubDocument} documentId={document._id} documentTitle={document.title} />
          <TagBar isViewMode={isViewMode} documentId={document._id} />
        </div>
        <div className={mainContentClasses}>
          <MainContentHeading documentId={document._id} documentTitle={document.title} isViewMode={isViewMode} openFullscreenEditorModal={() => this.openFullscreenEditorModal()} maturityLevel={document.maturityLevel} />
          <MainContentBody isViewMode={isViewMode} document={document} documentId={document._id} documentAccess={documentAccess} getPermissionLevel={(documentAccess) => this.getPermissionLevel(documentAccess)} />
        </div>
        {this.state.showSubDocuments ? <span><SubDocumentList documentId={document._id} /><div className='clearfix' /></span> : null}
        <div id='create-document-modal-root' ref='createDocumentModal' />
        <div id='fullscreen-editor-modal-root' ref='fullScreenEditorModal' />
        {isViewMode ? null : <CommentingArea documentId={document._id} />}
        <textarea id='tinymceTextarea' name='tinymceTextarea' />
        <iframe id='printf' name='printf' />
      </div>
    )
  }
}

DocumentDisplay.propTypes = {
  document: PropTypes.object.isRequired,
  documentAccess: PropTypes.object.isRequired,
  action: PropTypes.string,
  permission: PropTypes.string,
  accessKey: PropTypes.string
}

export default DocumentDisplay
