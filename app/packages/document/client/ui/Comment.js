import React, {Component} from 'react'
import Image from '../../../../../node_modules/react-bootstrap/lib/Image'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import { moment } from 'meteor/momentjs:moment'
import Rating from 'react-rating'
import classNames from 'classnames'
import CommentReply from './CommentReply'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { Counts } from 'meteor/tmeasday:publish-counts'
import RepliesArea from './RepliesArea'

function onPropsChange (props, onData) {
  let repliesCounterHandle = Meteor.subscribe('commentRepliesCount', {documentId: props.comment.documentId, parent: props.comment._id})
  if (repliesCounterHandle.ready()) {
    let commentRepliesCount = Counts.get('crc-' + props.comment._id)
    onData(null, {commentRepliesCount})
  }
}

class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      replyActive: false,
      repliesOpened: false
    }
  }
  handleReplyClick () {
    global.emitter.emit('reply-opened')
    setTimeout(() => {
      this.setState({
        replyActive: true
      })
    }, 100)
  }
  closeReply () {
    this.setState({
      replyActive: false
    })
  }
  openReplies () {
    this.setState({
      repliesOpened: true
    })
  }
  render () {
    const { comment, commentRepliesCount } = this.props
    let hrDividerClassNames = classNames({'no-margin-bottom': this.state.replyActive})
    let repliesLabel = 'replies'
    if (commentRepliesCount === 1) {
      repliesLabel = 'reply'
    }
    return <div className='comment-wrapper'>
      <div className='comment'>
        <div className='avatar-img-wrapper'>
          <Image src='https://randomuser.me/api/portraits/men/20.jpg' />
        </div>
        <div className='comment-content-wrapper'>
          <h4>{comment.createdBy}</h4>
          <div className='datetime'>
            {moment.max(moment(comment.createdAt).fromNow())}
          </div>
          <div className='content-text'>
            {comment.text}
          </div>
          {this.state.replyActive ? null : <div className='options-bar'>
            <ButtonToolbar className='options-buttons'>
              <Button bsSize='small' onClick={() => this.handleReplyClick()}>Reply</Button>
              {commentRepliesCount && commentRepliesCount > 0 ? <Button bsSize='small' onClick={() => this.openReplies()}>
                {'(' + commentRepliesCount + ') ' + repliesLabel + ' '}
                <span><span className='caret' /></span>
              </Button> : null}
            </ButtonToolbar>
            <div className='rating-wrapper'>
              <div className='rating-lbl-wrapper'>Level of agreement</div>
              <Rating
                fractions={2}
                initialRate={2.5}
                onChange={(rate) => { console.log('changed rating'); console.log(rate) }}
                onClick={(rate) => { console.log('clicked rating'); console.log(rate) }}
                onRate={(rate) => { console.log('rated rating'); console.log(rate) }} />
            </div>
          </div>}
        </div>
        <hr className={hrDividerClassNames} />
      </div>
      {this.state.replyActive ? <CommentReply parentComment={this.props.comment} closeReply={() => this.closeReply()} /> : null}
      {this.state.repliesOpened ? <RepliesArea parentComment={this.props.comment} /> : null}
    </div>
  }
}

export default composeWithTracker(onPropsChange)(Comment)