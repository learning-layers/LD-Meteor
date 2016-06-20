import React, {Component} from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { DocumentComments } from '../../lib/collections'
import Comment from './Comment'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('commentReplies', {parent: props.parentComment._id})
  if (handle.ready()) {
    let replies = DocumentComments.find({parents: props.parentComment._id}).fetch()
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

export default composeWithTracker(onPropsChange)(RepliesArea)
