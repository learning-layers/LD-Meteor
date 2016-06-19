import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { Documents } from '../../lib/collections'
import { composeWithTracker } from 'react-komposer'
import DocumentTags from './DocumentTags'
import CommentingArea from './CommentingArea'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('document', {id: props.id})
  if (handle.ready()) {
    let document = Documents.findOne({'_id': props.id})
    onData(null, {document})
  }
}

class Document extends Component {
  render () {
    const { document } = this.props
    return <div className='document container-fluid'>
      <div className='well breadcrumb-tag-wrapper'>
        <div className='hierarchy-bar'>Hierarchy:</div>
        <hr />
        <div className='tag-bar'>
          Tags:
          {' '}
          <button className='btn btn-default'>
            <span className='glyphicon glyphicon-plus' />
          </button>
          <DocumentTags documentId={document._id} />
        </div>
      </div>
      <div className='main-content panel panel-primary'>
        <div className='panel-heading'><h4 className='document-title'>{document.title}</h4></div>
        <div className='panel-body'>
          <div className='attachments-bar'>
          </div>
          <div className='content'>
            Document
          </div>
        </div>
      </div>
      <CommentingArea documentId={document._id} />
    </div>
  }
}

export default composeWithTracker(onPropsChange)(Document)
