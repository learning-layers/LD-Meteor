import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { Documents } from '../../lib/collections'
import { composeWithTracker } from 'react-komposer'
import DocumentTags from './DocumentTags'
import Comment from './Comment'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import DropdownButton from '../../../../../node_modules/react-bootstrap/lib/DropdownButton'
import MenuItem from '../../../../../node_modules/react-bootstrap/lib/MenuItem'

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
      <div className='commenting-section'>
        <div className='commenting-header'>
          <h4>Comments (14)</h4>
          <div className='options-top-bar'>
            <ButtonToolbar className='options-bar'>
              <Button bsSize='small'>Search</Button>
              <DropdownButton bsSize='small' title='Sort' id='sort-dropdown'>
                <MenuItem eventKey='1'>Most recent</MenuItem>
                <MenuItem eventKey='2'>Oldest</MenuItem>
                <MenuItem eventKey='2'>Most agreed upon</MenuItem>
              </DropdownButton>
              <Button bsSize='small'>Subscribe</Button>
            </ButtonToolbar>
          </div>
          <hr />
        </div>
        <Comment />
        <Comment />
      </div>
    </div>
  }
}

export default composeWithTracker(onPropsChange)(Document)
