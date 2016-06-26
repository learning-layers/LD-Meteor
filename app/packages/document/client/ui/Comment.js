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
import { Uploads } from '../../../fileUpload/lib/collections'
import defaultStyle from './defaultStyle'
import defaultMentionStyle from './defaultMentionStyle'
import { MentionsInput, Mention } from 'react-mentions'
import throttle from 'lodash/throttle'
import merge from 'lodash/merge'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import Alert from 'react-s-alert'

const style = merge({}, defaultStyle(), {
  suggestions: {
    list: {
      maxHeight: 100,
      overflow: 'auto'
    }
  }
})

function onPropsChange (props, onData) {
  let path = JSON.parse(JSON.stringify(props.comment.parents))
  if (!path) {
    path = []
  }
  path.push(props.comment._id)
  let repliesCounterHandle = Meteor.subscribe('commentRepliesCount', {documentId: props.comment.documentId, parent: path})
  let userProfileHandle = Meteor.subscribe('userprofile', {userId: props.comment.createdBy}) // TODO replace with more efficient subscription
  if (repliesCounterHandle.ready() && userProfileHandle.ready()) {
    let commentRepliesCount = Counts.get('crc-' + path.join(','))
    const author = Meteor.users.findOne({'_id': props.comment.createdBy})
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
    onData(null, {commentRepliesCount, author, userAvatarPath})
  }
}

let renderUserSuggestion = function (entry, search, highlightedDisplay, index) {
  return <div>{entry.display}</div>
}

let data = function (possibleSuggestions, search, callback) {
  Meteor.call('getMentions', {mentionSearch: search}, function (err, res) {
    if (err) {
      //
    }
    if (res) {
      let users = Meteor.users.find({ 'profile.name': { $regex: '^' + search, $options: 'i' } }).fetch()
      let suggestions = []
      users = users.concat(res)
      users.forEach(function (user) {
        suggestions.push({ id: user._id, display: user.profile.name })
      })
      let filteredPossibleSuggestions = possibleSuggestions.filter(function (suggestion) {
        return startsWith(suggestion.display, search, 0)
      })
      suggestions = uniqBy(filteredPossibleSuggestions.concat(suggestions), 'id')
      suggestions = sortBy(suggestions, 'display')
      callback(suggestions)
    }
  })
}

let startsWith = function (string, searchString, position) {
  position = position || 0
  return string.indexOf(searchString, position) === position
}

class Comment extends Component {
  constructor (props) {
    super(props)
    let commentText = ''
    if (this.props.comment) {
      commentText = this.props.comment.text
    }
    this.state = {
      value: commentText,
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
  handleChange (ev, value, plainTextVal, mentions) {
    this.setState({
      value: value,
      mentions: mentions,
      changed: true
    })
  }
  handleCancelEditClick () {
    let commentText = ''
    if (this.props.comment) {
      commentText = this.props.comment.text
    }
    this.setState({
      value: commentText,
      changed: false
    })
  }
  handleSaveClick () {
    Meteor.call('updateComment', this.props.comment._id, {
      documentId: this.props.comment.documentId,
      text: this.state.value,
      mentions: this.state.mentions,
      createdAt: this.props.comment.createdAt,
      createdBy: this.props.comment.createdBy
    }, (err, res) => {
      if (err) {
        Alert.error(err.message)
      }
      if (res) {
        Alert.success('SUCCESS: Updated your comment.')
        this.setState({
          changed: false
        })
      }
    })
  }
  render () {
    const { comment, commentRepliesCount, author, userAvatarPath } = this.props
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
            {moment.max(moment(comment.createdAt).fromNow())}
          </div>
          <div className='content-text not-editable'>
            <MentionsInput appendSpaceOnAdd value={this.state.value}
              style={style} onChange={(ev, value, plainTextVal, mentions) => this.handleChange(ev, value, plainTextVal, mentions)}
              placeholder={'Mention people using \'@\''}
              disabled={!this.state.editMode}>
              <Mention trigger='@' data={(search, callback) => throttle(data([], search, callback), 230)} style={defaultMentionStyle}
                renderSuggestion={(entry, search, highlightedDisplay, index) => renderUserSuggestion(entry, search, highlightedDisplay, index)} />
            </MentionsInput>
          </div>
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
      {this.state.replyActive ? <CommentReply
        parentComment={this.props.comment}
        closeReply={() => this.closeReply()}
        submitReplySuccess={() => this.submitReplySuccess()} /> : null}
      {this.state.repliesOpened ? <RepliesArea parentComment={this.props.comment} /> : null}
    </div>
  }
}

export default composeWithTracker(onPropsChange)(Comment)
