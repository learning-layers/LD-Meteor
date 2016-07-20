import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import DocumentTags from './DocumentTags'
import CommentingArea from './comment/CommentingArea'
import ContentEditor from './ContentEditor'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import DocumentSharingModal from './sharing/DocumentSharingModal'
import AttachmentsBar from './mainContent/AttachmentsBar'
import ContentViewer from './ContentViewer'
import FileAttachmentArea from './mainContent/fileAttachments/FileAttachmentArea'

class DocumentDisplay extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTabName: 'Editor',
      tagBarFocused: false,
      manageSharingModal: null
    }
  }
  componentWillUnmount () {
    let renderToElement = this.refs.manageSharingModal
    if (this.state.manageSharingModal !== null) {
      ReactDOM.unmountComponentAtNode(renderToElement)
    }
  }
  changeTab (tabName) {
    switch (tabName) {
      case 'Editor':
      case 'Files':
      case 'Media':
        this.setState({
          activeTabName: tabName
        })
        break
      default:
        break
    }
  }
  changeTagBarFocus (isFocused) {
    this.setState({
      tagBarFocused: isFocused
    })
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
          return <ContentEditor document={this.props.document} permissionLevel={this.getPermissionLevel()} />
        } else {
          return null
        }
      case 'Files':
        return <FileAttachmentArea />
      case 'Media':
        return 'Media'
      default:
        return <div>No section found</div>
    }
  }
  isViewMode () {
    return this.props.action && this.props.action === 'shared' && this.props.permission && this.props.permission === 'view' && this.props.accessKey
  }
  getPermissionLevel () {
    if (this.props.document.createdBy === Meteor.userId()) {
      return 'edit'
    } else if (this.isViewMode()) {
      return 'view'
    } else if (this.props.documentAccess) {
      const documentAccess = this.props.documentAccess
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
            return 'view'
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
    let { document } = this.props
    const isViewMode = this.isViewMode()
    const permissionLevel = this.getPermissionLevel()
    console.debug('isViewMode=', isViewMode)
    console.debug('permissions=', permissionLevel)
    return <div className='document container-fluid'>
      <div className='well breadcrumb-tag-wrapper'>
        <div style={{display: 'none'}} className='hierarchy-bar'>Hierarchy:</div>
        <hr style={{display: 'none'}} />
        <div className='tag-bar'>
          <label htmlFor='document-tags' className={this.state.tagBarFocused ? 'active' : ''}>Tags</label>
          <DocumentTags disabled={isViewMode} onFocus={() => this.changeTagBarFocus(true)} onBlur={() => this.changeTagBarFocus(false)} documentId={document._id} />
        </div>
      </div>
      <div className='main-content panel panel-primary'>
        <div className='panel-heading'>
          <h4 className='document-title'>{document.title}</h4>
          {isViewMode ? null : <ButtonToolbar className='options-buttons'>
            <Button className='delete-group-button' bsSize='small' onClick={() => this.openDocumentSharingModal()}>
              <span className='glyphicon glyphicon glyphicon-share-alt' />
            </Button>
          </ButtonToolbar>}
          {isViewMode ? null : <div ref='manageSharingModal'></div>}
        </div>
        <div className='panel-body'>
          {this.props.document ? <AttachmentsBar
            documentId={this.props.document._id}
            onChangeTabSelection={(tabName) => this.changeTab(tabName)}
            activeTabName={this.state.activeTabName} /> : null}
          <div className='content'>
            {this.contentSection(this.state.activeTabName)}
          </div>
        </div>
      </div>
      {isViewMode ? null : <CommentingArea documentId={document._id} />}
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
