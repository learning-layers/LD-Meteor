import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { Documents } from '../../lib/collections'
import { composeWithTracker } from 'react-komposer'
import DocumentTags from './DocumentTags'
import CommentingArea from './CommentingArea'
import Loader from 'react-loader'
import classNames from 'classnames'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import DocumentSharingModal from './DocumentSharingModal'
import NotFound from '../../../../common/client/ui/mainLayout/NotFound'
import IFrameWithOnLoad from './IframeWithOnLoad'

const etherpadEndpoint = Meteor.settings.public.etherpad.endpoint

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('document', {id: props.id}, {
    /* onReady: function () { // TODO cleanup -> find a better solution for reactive updates here
      let document = Documents.findOne({'_id': props.id})
      onData(null, {document})
    },*/
    onError: function (err) {
      onData(null, {err: err})
    }
  })
  if (handle.ready()) {
    let document = Documents.findOne({'_id': props.id})
    onData(null, {document})
  }
}

class AttachmentsBar extends Component {
  render () {
    let editorTabClassNames = classNames({'active': this.props.activeTabName === 'Editor'})
    let filesTabClassNames = classNames({'active': this.props.activeTabName === 'Files'})
    let mediaTabClassNames = classNames({'active': this.props.activeTabName === 'Media'})
    return <div className='attachments-bar'>
      <ul className='attachment-icons'>
        <li className={editorTabClassNames} onClick={() => this.props.onChangeTabSelection('Editor')}>
          <div className='icon-wrapper'>
            <span className='glyphicon glyphicon-pencil' />
          </div>
        </li>
        <li className={filesTabClassNames} onClick={() => this.props.onChangeTabSelection('Files')}>
          <div className='icon-wrapper'>
            <span className='glyphicon glyphicon-file' />
          </div>
        </li>
        <li className={mediaTabClassNames} onClick={() => this.props.onChangeTabSelection('Media')}>
          <div className='icon-wrapper'>
            <span className='glyphicon glyphicon-picture' />
          </div>
        </li>
      </ul>
    </div>
  }
}

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
  onIframeLoaded () {
    window.alert('IFrame loaded')
  }
  render () {
    const { document, err } = this.props
    if (!document) {
      if (err) {
        if (err.error === 403) {
          return <div className='container'>
            You currently don't have access to this document.
            If you want access ask the document author to grant you access to the document.
            <button className='btn btn-default' onClick={() => window.location.reload()}>
              Reload the page
            </button>
          </div>
        } else {
          return <div className='container'>
            Ooops something went wrong. Please contact the administrator of this website.
          </div>
        }
      } else {
        return <NotFound />
      }
    }

    let etherpadGroup = document.etherpadGroup
    let etherpadGroupPad = document.etherpadGroupPad
    if (!etherpadGroup) {
      // send a request to the server that the server should create a group and a pad in etherpad
      Meteor.call('createEtherpadGroupAndPad', document._id)
    }

    let etherpadPadUrl = etherpadEndpoint + '/p/' + etherpadGroupPad

    return <div className='document container-fluid'>
      <div className='well breadcrumb-tag-wrapper'>
        <div className='hierarchy-bar'>Hierarchy:</div>
        <hr />
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
            {this.state.activeTabName}
            {etherpadGroup ? <div>{etherpadGroupPad ? 'etherpad exists (2/2)' : 'etherpad exists (1/2)'}</div> : 'etherpad doesn\'t exist (0/2)'}
            {etherpadGroupPad ? <IFrameWithOnLoad id='etherpadEditorIframe' name='etherpadEditor' src={etherpadPadUrl} scrolling='no' onLoaded={this.onIframeLoaded} seamless /> : null}
          </div>
        </div>
      </div>
      <CommentingArea documentId={document._id} />
    </div>
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(Document)
