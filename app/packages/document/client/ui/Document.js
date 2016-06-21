import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { Documents } from '../../lib/collections'
import { composeWithTracker } from 'react-komposer'
import DocumentTags from './DocumentTags'
import CommentingArea from './CommentingArea'
import Loader from 'react-loader'
import classNames from 'classnames'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('document', {id: props.id})
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
      activeTabName: 'Editor'
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
  render () {
    const { document } = this.props
    return <div className='document container-fluid'>
      <div className='well breadcrumb-tag-wrapper'>
        <div className='hierarchy-bar'>Hierarchy:</div>
        <hr />
        <div className='tag-bar'>
          <label for='document-tags'>Tags</label>
          <DocumentTags documentId={document._id} />
        </div>
      </div>
      <div className='main-content panel panel-primary'>
        <div className='panel-heading'><h4 className='document-title'>{document.title}</h4></div>
        <div className='panel-body'>
          <AttachmentsBar onChangeTabSelection={(tabName) => this.changeTab(tabName)} activeTabName={this.state.activeTabName} />
          <div className='content'>
            {this.state.activeTabName}
          </div>
        </div>
      </div>
      <CommentingArea documentId={document._id} />
    </div>
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(Document)
