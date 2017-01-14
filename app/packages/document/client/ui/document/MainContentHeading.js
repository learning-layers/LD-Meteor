import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import DocumentStatusIndicator from '../DocumentStatusIndicator'
import EditableDocumentTitleInput from '../document/EditableDocumentTitleInput'
import ButtonToolbar from '../../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../../node_modules/react-bootstrap/lib/Button'
import SubDocumentCounter from '../SubDocumentCounter'
import SubscribeButton from '../SubscribeButton'
import DocumentSharingModal from '../sharing/DocumentSharingModal'

class MainContentHeading extends Component {
  constructor (props) {
    super(props)
    this.state = {
      manageSharingModal: null
    }
  }
  openDocumentSharingModal () {
    let renderToElement = this.refs.manageSharingModal
    if (!this.state.manageSharingModal) {
      const { documentId } = this.props
      this.state.manageSharingModal = ReactDOM.render(<DocumentSharingModal documentId={documentId} />, renderToElement)
    } else {
      this.state.manageSharingModal.open()
    }
  }
  componentWillUnmount () {
    let renderToElement = this.refs.manageSharingModal
    if (this.state.manageSharingModal !== null) {
      ReactDOM.unmountComponentAtNode(renderToElement)
    }
  }
  render () {
    const { isViewMode, documentId, maturityLevel, documentTitle, openFullscreenEditorModal } = this.props
    return (
      <div className='panel-heading'>
        <DocumentStatusIndicator documentId={documentId} documentStatus={maturityLevel} />
        <EditableDocumentTitleInput documentId={documentId} documentTitle={documentTitle} />
        {isViewMode ? null : <ButtonToolbar className='options-buttons'>
          <SubscribeButton documentId={documentId} />
          <Button className='open-fullscreen-modal-button' bsSize='small' onClick={openFullscreenEditorModal} data-tooltip='Fullsceen'>
            <span className='glyphicon glyphicon-resize-full' />
          </Button>
          <Button className='open-sharing-modal-button' bsSize='small' onClick={() => this.openDocumentSharingModal()} data-tooltip='Share'>
            Share&nbsp;<span className='glyphicon glyphicon glyphicon-share-alt' />
          </Button>
          <SubDocumentCounter documentId={documentId} />
        </ButtonToolbar>}
        {isViewMode ? null : <div ref='manageSharingModal' />}
      </div>
    )
  }
}

MainContentHeading.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentTitle: PropTypes.string.isRequired,
  isViewMode: PropTypes.bool,
  openFullscreenEditorModal: PropTypes.func.isRequired,
  maturityLevel: PropTypes.string
}

export default MainContentHeading
