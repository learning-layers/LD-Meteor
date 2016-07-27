import React, {Component} from 'react'
import { moment } from 'meteor/momentjs:moment'
import Rating from 'react-rating'
import classNames from 'classnames'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { Counts } from 'meteor/tmeasday:publish-counts'
import Alert from 'react-s-alert'
import { DocumentComments } from '../../../lib/collections'
import Image from '../../../../../../node_modules/react-bootstrap/lib/Image'
import ButtonToolbar from '../../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../../node_modules/react-bootstrap/lib/Button'
import { Uploads } from '../../../../fileUpload/lib/collections'
import CommentContent from './CommentContent'
import CommentReply from './CommentReply'
import RepliesArea from './RepliesArea'
import { TimeFromNow } from '../../../../../common/both/ui/util/TimeFromNow'

function onPropsChange (props, onData) {
  let path = JSON.parse(JSON.stringify(props.comment.parents))
  if (!path) {
    path = []
  }
  path.push(props.comment._id)
  let repliesCounterHandle = Meteor.subscribe('commentRepliesCount', {documentId: props.comment.documentId, parent: path})
  let userProfileHandle = Meteor.subscribe('userprofile', {userId: props.comment.createdBy}) // TODO replace with more efficient subscription
  if (repliesCounterHandle.ready() && userProfileHandle.ready()) {
    let commentRepliesCount
    if (Meteor.isClient) {
      commentRepliesCount = Counts.get('crc-' + path.join(','))
    } else {
      commentRepliesCount = DocumentComments.find({
        documentId: props.comment.documentId,
        parents: { $all: [ path ] }
      }).count()
    }
    const author = Meteor.users.findOne({'_id': props.comment.createdBy})
    if (author) {
      let userId = author._id
      const userAvatar = Uploads.collection.findOne({
        'meta.parent.uploadType': 'avatar',
        'meta.parent.elementId': userId
      })
      let userAvatarPath
      if (userAvatar) {
        userAvatarPath = userAvatar._downloadRoute + '/' + userAvatar._collectionName + '/' + userAvatar._id + '/original/' + userAvatar._id + '.' + userAvatar.extension
      }
      if (!userAvatarPath) {
        userAvatarPath = '/img/Portrait_placeholder.png'
      }
      // retrieve revisions
      const revisionCount = DocumentComments.find({ revisionOf: props.comment._id }).count()
      const lastRevision = DocumentComments.findOne({ revisionOf: props.comment._id }, {
        limit: 1,
        sort: { movedToRevisionsAt: -1 }
      })
      onData(null, { commentRepliesCount, author, userAvatarPath, revisionCount, lastRevision })
    }
  }
}

class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      replyActive: false,
      repliesOpened: false,
      editMode: false,
      changed: false
    }
  }
  handleReplyClick () {
    global.emitter.emit('reply-opened')
    setTimeout(() => {
      this.setState({
        replyActive: true,
        changed: false
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
      repliesOpened: !this.state.repliesOpened
    })
  }
  submitReplySuccess () {
    this.setState({
      repliesOpened: true,
      replyActive: false
    })
  }
  handleEditClick () {
    this.setState({
      repliesOpened: true,
      replyActive: false,
      editMode: true,
      changed: true
    })
  }
  handleCancelEditClick () {
    let commentText = ''
    if (this.props.comment) {
      commentText = this.props.comment.text
    }
    this.refs.commentContent.setState({value: commentText})
  }
  handleSaveClick () {
    Meteor.call('updateComment', this.props.comment._id, {
      documentId: this.props.comment.documentId,
      text: this.refs.commentContent.state.value,
      mentions: this.refs.commentContent.state.mentions,
      createdAt: this.props.comment.createdAt,
      createdBy: this.props.comment.createdBy
    }, (err, res) => {
      if (err) {
        Alert.error(err.message)
      }
      if (res) {
        Alert.success('SUCCESS: Updated your comment.')
        this.setState({
          changed: false,
          editMode: false
        })
      }
    })
  }
  render () {
    const { comment, commentRepliesCount, author, userAvatarPath, revisionCount, lastRevision } = this.props
    let hrDividerClassNames = classNames({'no-margin-bottom': this.state.replyActive})
    let repliesLabel = 'replies'
    if (commentRepliesCount === 1) {
      repliesLabel = 'reply'
    }
    const isOwnComment = comment.createdBy === Meteor.userId()
    return <div className='comment-wrapper'>
      <div className='comment'>
        <div className='avatar-img-wrapper'>
          <Image src={userAvatarPath} />
        </div>
        <div className='comment-content-wrapper'>
          <h4>{author.profile.name}</h4>
          <div className='datetime'>
            <TimeFromNow date={comment.createdAt} />
          </div>
          <div className='content-text not-editable'>
            <CommentContent ref='commentContent' text={this.props.comment.text} editMode={this.state.editMode} />
          </div>
          {revisionCount > 0 ? <div className='well'>
            This comment has been edited {revisionCount} times. (last edit: {moment.max(moment(lastRevision.movedToRevisionsAt)).fromNow()})
          </div> : null}
          {this.state.replyActive ? null : <div className='options-bar'>
            <ButtonToolbar className='options-buttons'>
              {isOwnComment && !this.state.changed ? <Button bsSize='small' onClick={() => this.handleEditClick()}>Edit</Button> : null}
              {this.state.changed ? <Button bsSize='small' bsStyle='info' onClick={() => this.handleCancelEditClick()}>Cancel Edit</Button> : null}
              {this.state.changed ? <Button bsSize='small' bsStyle='success' onClick={() => this.handleSaveClick()}>Save Edit</Button> : null}
              <Button bsSize='small' onClick={() => this.handleReplyClick()}>Reply</Button>
              {commentRepliesCount && commentRepliesCount > 0 ? <Button bsSize='small' onClick={() => this.openReplies()}>
                {'(' + commentRepliesCount + ') ' + repliesLabel + ' '}
                <span>{this.state.repliesOpened ? <span className='caret' /> : <span className='caret caret-right' />}</span>
              </Button> : null}
            </ButtonToolbar>
            <div className='rating-wrapper'>
              <div style={{display: 'none'}} className='rating-lbl-wrapper'>Level of agreement</div>
              <Rating
                style={{display: 'none'}}
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
      {this.state.replyActive ? <CommentReply
        parentComment={this.props.comment}
        closeReply={() => this.closeReply()}
        submitReplySuccess={() => this.submitReplySuccess()} /> : null}
      {this.state.repliesOpened ? <RepliesArea parentComment={this.props.comment} /> : null}
    </div>
  }
}

Comment.propTypes = {
  comment: React.PropTypes.object,
  commentRepliesCount: React.PropTypes.number,
  'comment.text': React.PropTypes.string,
  'comment._id': React.PropTypes.string,
  'comment.createdAt': React.PropTypes.string,
  'comment.createdBy': React.PropTypes.string,
  userAvatarPath: React.PropTypes.string,
  author: React.PropTypes.object,
  revisionCount: React.PropTypes.number,
  lastRevision: React.PropTypes.object
}

export default composeWithTracker(onPropsChange)(Comment)
