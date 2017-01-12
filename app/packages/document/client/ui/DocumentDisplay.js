import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import CommentingArea from './comment/CommentingArea'
import ContentEditor from './mainContent/contentEditor/ContentEditor'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import SubscribeButton from './SubscribeButton'
import EventEmitterInstance from '../../../../common/client/EventEmitter'
import DocumentSharingModal from './sharing/DocumentSharingModal'
import AttachmentsBar from './mainContent/AttachmentsBar'
import ContentViewer from './mainContent/contentEditor/ContentViewer'
import FileAttachmentArea from './mainContent/fileAttachments/FileAttachmentArea'
import HistoryArea from './mainContent/history/HistoryArea'
import CreateDocumentModal from './CreateDocumentModal'
import SubDocumentCounter from './SubDocumentCounter'
import SubDocumentList from './SubDocumentList'
import DocumentStatusIndicator from './DocumentStatusIndicator'
import { Groups } from '../../../groups/lib/collections'
import FullScreenEditorModal from './mainContent/contentEditor/FullScreenEditorModal'
import Breadcrumbs from './document/Breadcrumbs'
import EditableDocumentTitleInput from './document/EditableDocumentTitleInput'
import TagBar from './document/TagBar'

class DocumentDisplay extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTabName: 'Editor',
      manageSharingModal: null,
      openCreateDocumentModal: null,
      breadcrumbs: [],
      showSubDocuments: false
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
    this.openShowSubdocumentsSubscription = EventEmitterInstance.addListener('doc-open-subdocs', (open) => { this.toggleShowSubdocuments(open) })
    this.toggleShowSubdocumentsSubscription = EventEmitterInstance.addListener('doc-toggle-subdocs', () => { this.toggleShowSubdocuments() })
    if (this.props.document.isSubDocument) {
      Meteor.setTimeout(() => {
        Meteor.call('getSubDocumentBreadcrumbs', this.props.document._id, (err, res) => {
          if (err) {
            //
          }
          if (res) {
            this.setState({
              breadcrumbs: res
            })
          }
        })
      }, 100)
    }
  }
  componentWillUnmount () {
    let renderToElement = this.refs.manageSharingModal
    if (this.state.manageSharingModal !== null) {
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
  componentWillReceiveProps (nextProps) {
    if (nextProps.document.isSubDocument) {
      Meteor.setTimeout(() => {
        Meteor.call('getSubDocumentBreadcrumbs', nextProps.document._id, (err, res) => {
          if (err) {
            //
          }
          if (res) {
            this.setState({
              breadcrumbs: res
            })
          }
        })
      }, 100)
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
  openFullscreenEditorModal () {
    let renderToElement = this.refs.fullScreenEditorModal
    if (!this.state.openFullScreenEditorModal) {
      this.state.openFullScreenEditorModal = ReactDOM.render(<FullScreenEditorModal document={this.props.document} permissionLevel={this.getPermissionLevel(this.props.documentAccess)} />, renderToElement)
    } else {
      this.state.openFullScreenEditorModal.open(this.props.document, this.getPermissionLevel(this.props.documentAccess))
    }
  }
  changeTab (tabName) {
    switch (tabName) {
      case 'Editor':
      case 'Files':
      case 'History':
      case 'Media':
        this.setState({
          activeTabName: tabName
        })
        break
      default:
        break
    }
  }
  openDocumentSharingModal () {
    let renderToElement = this.refs.manageSharingModal
    if (!this.state.manageSharingModal) {
      this.state.manageSharingModal = ReactDOM.render(<DocumentSharingModal documentId={this.props.document._id} />, renderToElement)
    } else {
      this.state.manageSharingModal.open()
    }
  }
  contentSection (activeTabName) {
    switch (activeTabName) {
      case 'Editor':
        if (this.props.document && this.isViewMode()) {
          // if a sharing link has been used, no user logged in
          return <ContentViewer documentId={this.props.document._id} accessKey={this.props.accessKey} />
        } else if (this.props.document) {
          // user is logged in
          return <ContentEditor document={this.props.document} permissionLevel={this.getPermissionLevel(this.props.documentAccess)} />
        } else {
          return null
        }
      case 'Files':
        return <FileAttachmentArea documentId={this.props.document._id} />
      case 'Media':
        return 'Media'
      case 'History':
        return <HistoryArea documentId={this.props.document._id} />
      default:
        return <div>No section found</div>
    }
  }
  isViewMode () {
    return this.props.action && this.props.action === 'shared' && this.props.permission && this.props.permission === 'view' && this.props.accessKey
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
  toggleShowSubdocuments (open) {
    if (open) {
      this.setState({
        showSubDocuments: true
      })
    } else {
      this.setState({
        showSubDocuments: !this.state.showSubDocuments
      })
    }
  }
  render () {
    let { document } = this.props
    const isViewMode = this.isViewMode()
    // const permissionLevel = this.getPermissionLevel()
    // console.log('isViewMode=', isViewMode)
    // console.log('permissions=', permissionLevel)
    let mainContentClasses = 'main-content panel panel-primary'
    if (this.state.showSubDocuments) {
      mainContentClasses += ' show-sub-docs'
    }
    return <div className='document container-fluid'>
      <div className='well breadcrumb-tag-wrapper'>
        <Breadcrumbs breadcrumbs={this.state.breadcrumbs} documentTitle={document.title} />
        <TagBar isViewMode={isViewMode} documentId={document._id} />
      </div>
      <div className={mainContentClasses}>
        <div className='panel-heading'>
          <DocumentStatusIndicator documentId={document._id} documentStatus={document.maturityLevel} />
          <EditableDocumentTitleInput documentId={document._id} documentTitle={document.title} />
          {isViewMode ? null : <ButtonToolbar className='options-buttons'>
            <SubscribeButton documentId={document._id} />
            <Button className='open-fullscreen-modal-button' bsSize='small' onClick={() => this.openFullscreenEditorModal()} data-tooltip='Fullsceen'>
              <span className='glyphicon glyphicon-resize-full' />
            </Button>
            <Button className='open-sharing-modal-button' bsSize='small' onClick={() => this.openDocumentSharingModal()} data-tooltip='Share'>
              Share&nbsp;<span className='glyphicon glyphicon glyphicon-share-alt' />
            </Button>
            <SubDocumentCounter documentId={document._id} />
          </ButtonToolbar>}
          {isViewMode ? null : <div ref='manageSharingModal' />}
        </div>
        <div className='panel-body'>
          {this.props.document ? <AttachmentsBar
            documentId={document._id}
            onChangeTabSelection={(tabName) => this.changeTab(tabName)}
            activeTabName={this.state.activeTabName} /> : null}
          <div className='content'>
            {this.contentSection(this.state.activeTabName)}
          </div>
        </div>
      </div>
      {this.state.showSubDocuments ? <span><SubDocumentList documentId={document._id} /><div className='clearfix' /></span> : null}
      <div ref='createDocumentModal' />
      <div ref='fullScreenEditorModal' />
      {isViewMode ? null : <CommentingArea documentId={document._id} />}
      <textarea id='tinymceTextarea' name='tinymceTextarea' />
      <iframe id='printf' name='printf' />
    </div>
  }
}

DocumentDisplay.propTypes = {
  document: React.PropTypes.object,
  action: React.PropTypes.string,
  permission: React.PropTypes.string,
  accessKey: React.PropTypes.string,
  documentAccess: React.PropTypes.object
}

export default DocumentDisplay
