import React, {Component} from 'react'
import { compose } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { Counts } from 'meteor/tmeasday:publish-counts'
import Comment from './Comment'
import ButtonToolbar from '../../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../../node_modules/react-bootstrap/lib/Button'
import DropdownButton from '../../../../../../node_modules/react-bootstrap/lib/DropdownButton'
import MenuItem from '../../../../../../node_modules/react-bootstrap/lib/MenuItem'
import { DocumentComments } from '../../../lib/collections'
import CreateNewComment from './CreateNewComment'
import { Tracker } from 'meteor/tracker'

function getTrackerLoader (reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env)
      })
    })

    return () => {
      if (typeof trackerCleanup === 'function') trackerCleanup()
      return handler.stop()
    }
  }
}

function onPropsChange (props, onData) {
  let commentsHandle = Meteor.subscribe('documentComments', {documentId: props.documentId})
  let commentsCounterHandle = Meteor.subscribe('documentCommentsCount', {documentId: props.documentId})
  if (commentsHandle.ready() && commentsCounterHandle.ready()) {
    let documentComments = DocumentComments.find({
      documentId: props.documentId,
      parents: {'$type': 10},
      revisionOf: {$exists: false},
      movedToRevisionsAt: {$exists: false}
    }).fetch()
    let documentCommentsCount
    if (Meteor.isClient) {
      documentCommentsCount = Counts.get('documentCommentsCount')
    } else {
      documentCommentsCount = DocumentComments.find({
        documentId: props.documentId,
        movedToRevisionsAt: {$exists: false}
      }).count()
    }
    onData(null, {documentComments, documentCommentsCount})
  }
}

class CommentingArea extends Component {
  render () {
    const { documentId, documentComments, documentCommentsCount } = this.props
    return <div className='commenting-section'>
      <CreateNewComment documentId={documentId} />
      <div className='commenting-section-comments'>
        <div className='commenting-header'>
          <h4>Comments ({documentCommentsCount})</h4>
          <div className='options-top-bar'>
            <ButtonToolbar className='options-bar'>
              <Button bsSize='small' style={{display: 'none'}}>Search</Button>
              <DropdownButton bsSize='small' title='Sort' id='sort-dropdown' style={{display: 'none'}}>
                <MenuItem eventKey='1'>Most recent</MenuItem>
                <MenuItem eventKey='2'>Oldest</MenuItem>
                <MenuItem eventKey='2'>Most agreed upon</MenuItem>
              </DropdownButton>
              <Button bsSize='small' style={{display: 'none'}}>Subscribe</Button>
            </ButtonToolbar>
          </div>
          <hr />
        </div>
        {documentComments.map(function (documentComment) {
          return <Comment key={'dc-' + documentComment._id} comment={documentComment} />
        })}
      </div>
    </div>
  }
}

CommentingArea.propTypes = {
  documentId: React.PropTypes.string,
  documentComments: React.PropTypes.array,
  documentCommentsCount: React.PropTypes.number
}

export default compose(getTrackerLoader(onPropsChange))(CommentingArea)
