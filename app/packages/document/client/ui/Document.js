import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Loader from 'react-loader'
import classNames from 'classnames'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import DocumentSharingModal from './sharing/DocumentSharingModal'
import NotFound from '../../../../common/client/ui/mainLayout/NotFound'
import ContentEditor from './ContentEditor'
import { Documents } from '../../lib/collections'
import DocumentTags from './DocumentTags'
import CommentingArea from './comment/CommentingArea'
import RequestAccess from './sharing/RequestAccess'

function onPropsChange (props, onData) {
  if (props.action && props.action === 'shared' && props.permission && props.accessKey) {
    let handle = Meteor.subscribe('document', { id: props.id, action: props.action, permission: props.permission, accessKey: props.accessKey }, {
      /* onReady: function () { // TODO cleanup -> find a better solution for reactive updates here
       let document = Documents.findOne({'_id': props.id})
       onData(null, {document})
       },*/
      onError: function (err) {
        onData(null, { err: err })
      }
    })
    if (handle.ready()) {
      let document = Documents.findOne({ '_id': props.id })
      onData(null, { document })
    }
  } else {
    let handle = Meteor.subscribe('document', { id: props.id }, {
      /* onReady: function () { // TODO cleanup -> find a better solution for reactive updates here
       let document = Documents.findOne({'_id': props.id})
       onData(null, {document})
       },*/
      onError: function (err) {
        onData(null, { err: err })
      }
    })
    if (handle.ready()) {
      let document = Documents.findOne({ '_id': props.id })
      onData(null, { document })
    }
  }
}

class AttachmentsBar extends Component {
  render () {
    let editorTabClassNames = classNames({'active': this.props.activeTabName === 'Editor'})
    // let filesTabClassNames = classNames({'active': this.props.activeTabName === 'Files'})
    // let mediaTabClassNames = classNames({'active': this.props.activeTabName === 'Media'})
    return <div className='attachments-bar'>
      <ul className='attachment-icons'>
        <li className={editorTabClassNames} onClick={() => this.props.onChangeTabSelection('Editor')}>
          <div className='icon-wrapper'>
            <span className='glyphicon glyphicon-pencil' />
          </div>
        </li>
      </ul>
    </div>
  }
}

/* <li className={filesTabClassNames} onClick={() => this.props.onChangeTabSelection('Files')}>
 <div className='icon-wrapper'>
 <span className='glyphicon glyphicon-file' />
 </div>
 </li>
 <li className={mediaTabClassNames} onClick={() => this.props.onChangeTabSelection('Media')}>
 <div className='icon-wrapper'>
 <span className='glyphicon glyphicon-picture' />
 </div>
 </li> */

class Document extends Component {
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
        return <div>{this.props.document ? <ContentEditor document={this.props.document} /> : null}</div>
      case 'Files':
        return 'Files'
      case 'Media':
        return 'Media'
      default:
        return <div>No section found</div>
    }
  }
  render () {
    const { document, err } = this.props
    if (!document) {
      if (err) {
        if (err.error === 403) {
          return <div className='container'>
            <RequestAccess documentId={this.props.id} />
          </div>
        } else {
          return <div className='container'>
            Ooops something went wrong. Please contact the administrator of this website.
          </div>
        }
      } else if (this.props.action === 'shared') {
        return <div className='document container-fluid'>'Sharing link action'</div>
      } else {
        return <NotFound />
      }
    }
    return <div className='document container-fluid'>
      <div className='well breadcrumb-tag-wrapper'>
        <div style={{display: 'none'}} className='hierarchy-bar'>Hierarchy:</div>
        <hr style={{display: 'none'}} />
        <div className='tag-bar'>
          <label for='document-tags' className={this.state.tagBarFocused ? 'active' : ''}>Tags</label>
          <DocumentTags onFocus={() => this.changeTagBarFocus(true)} onBlur={() => this.changeTagBarFocus(false)} documentId={document._id} />
        </div>
      </div>
      <div className='main-content panel panel-primary'>
        <div className='panel-heading'>
          <h4 className='document-title'>{document.title}</h4>
          <ButtonToolbar className='options-buttons'>
            <Button className='delete-group-button' bsSize='small' onClick={() => this.openDocumentSharingModal()}>
              <span className='glyphicon glyphicon glyphicon-share-alt' />
            </Button>
          </ButtonToolbar>
          <div ref='manageSharingModal'></div>
        </div>
        <div className='panel-body'>
          <AttachmentsBar onChangeTabSelection={(tabName) => this.changeTab(tabName)} activeTabName={this.state.activeTabName} />
          <div className='content'>
            {this.contentSection(this.state.activeTabName)}
          </div>
        </div>
      </div>
      <CommentingArea documentId={document._id} />
    </div>
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(Document)
