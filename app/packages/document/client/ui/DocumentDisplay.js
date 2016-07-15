import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import DocumentTags from './DocumentTags'
import CommentingArea from './comment/CommentingArea'
import ContentEditor from './ContentEditor'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import DocumentSharingModal from './sharing/DocumentSharingModal'
import AttachmentsBar from './mainContent/AttachmentsBar'
import ContentViewer from './ContentViewer'

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
        if (this.isViewMode()) {
          // if a sharing link has been used, no user logged in
          return <div><ContentViewer documentId={this.props.document._id} accessKey={this.props.accessKey} /></div>
        } else {
          // user is logged in
          return <div>{this.props.document ? <ContentEditor document={this.props.document} /> : null}</div>
        }
      case 'Files':
        return 'Files'
      case 'Media':
        return 'Media'
      default:
        return <div>No section found</div>
    }
  }
  isViewMode () {
    return this.props.action && this.props.action === 'shared' && this.props.permission && this.props.permission === 'view' && this.props.accessKey
  }
  render () {
    let { document } = this.props
    const isViewMode = this.isViewMode()
    return <div className='document container-fluid'>
      <div className='well breadcrumb-tag-wrapper'>
        <div style={{display: 'none'}} className='hierarchy-bar'>Hierarchy:</div>
        <hr style={{display: 'none'}} />
        <div className='tag-bar'>
          <label for='document-tags' className={this.state.tagBarFocused ? 'active' : ''}>Tags</label>
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
          <AttachmentsBar onChangeTabSelection={(tabName) => this.changeTab(tabName)} activeTabName={this.state.activeTabName} />
          <div className='content'>
            {this.contentSection(this.state.activeTabName)}
          </div>
        </div>
      </div>
      {isViewMode ? null : <CommentingArea documentId={document._id} />}
    </div>
  }
}

export default DocumentDisplay
