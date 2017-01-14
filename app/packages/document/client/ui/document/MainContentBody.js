import React, { Component, PropTypes } from 'react'
import AttachmentsBar from '../mainContent/AttachmentsBar'
import ContentViewer from '../mainContent/contentEditor/ContentViewer'
import ContentEditor from '../mainContent/contentEditor/ContentEditor'
import FileAttachmentArea from '../mainContent/fileAttachments/FileAttachmentArea'
import HistoryArea from '../mainContent/history/HistoryArea'

class MainContentBody extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTabName: 'Editor'
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
  contentSection (activeTabName) {
    switch (activeTabName) {
      case 'Editor':
        if (this.props.document && this.props.isViewMode) {
          // if a sharing link has been used, no user logged in
          return <ContentViewer documentId={this.props.documentId} accessKey={this.props.accessKey} />
        } else if (this.props.document) {
          // user is logged in
          return <ContentEditor document={this.props.document} permissionLevel={this.props.getPermissionLevel(this.props.documentAccess)} />
        } else {
          return null
        }
      case 'Files':
        return <FileAttachmentArea documentId={this.props.documentId} />
      case 'Media':
        return 'Media'
      case 'History':
        return <HistoryArea documentId={this.props.documentId} />
      default:
        return <div>No section found</div>
    }
  }
  render () {
    const { documentId } = this.props
    return (
      <div className='panel-body'>
        {documentId ? <AttachmentsBar
          documentId={documentId}
          onChangeTabSelection={(tabName) => this.changeTab(tabName)}
          activeTabName={this.state.activeTabName} /> : null}
        <div className='content'>
          {this.contentSection(this.state.activeTabName)}
        </div>
      </div>
    )
  }
}

MainContentBody.propTypes = {
  isViewMode: PropTypes.bool,
  document: PropTypes.object.isRequired,
  documentId: PropTypes.string.isRequired,
  documentAccess: PropTypes.object.isRequired,
  getPermissionLevel: PropTypes.func.isRequired
}

export default MainContentBody
