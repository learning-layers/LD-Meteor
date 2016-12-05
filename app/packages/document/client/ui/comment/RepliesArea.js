import React, {Component} from 'react'
import { compose } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { DocumentComments } from '../../../lib/collections'
import Comment from './Comment'
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
  let path = JSON.parse(JSON.stringify(props.parentComment.parents))
  if (!path) {
    path = []
  }
  path.push(props.parentComment._id)
  let handle = Meteor.subscribe('commentReplies', {documentId: props.parentComment.documentId, parent: path})
  if (handle.ready()) {
    let replies = DocumentComments.find({documentId: props.parentComment.documentId, parents: {$all: [path]}}).fetch()
    onData(null, {replies})
  }
}

class RepliesArea extends Component {
  render () {
    const { replies } = this.props
    return <div className='replies-area'>
      {replies.map(function (reply) {
        return <Comment key={'dc-' + reply._id} comment={reply} />
      })}
    </div>
  }
}

RepliesArea.propTypes = {
  replies: React.PropTypes.array
}

export default compose(getTrackerLoader(onPropsChange))(RepliesArea)
