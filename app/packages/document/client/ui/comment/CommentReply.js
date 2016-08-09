import React, {Component} from 'react'
import {Meteor} from 'meteor/meteor'
import { MentionsInput, Mention } from 'react-mentions'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import merge from 'lodash/merge'
import throttle from 'lodash/throttle'
import Alert from 'react-s-alert'
import defaultStyle from '../defaultStyle'
import defaultMentionStyle from '../defaultMentionStyle'
import ButtonToolbar from '../../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../../node_modules/react-bootstrap/lib/Button'
import EventEmitterInstance from '../../../../../common/client/EventEmitter'

const style = merge({}, defaultStyle(), {
  suggestions: {
    list: {
      maxHeight: 100,
      overflow: 'auto'
    }
  }
})

let renderUserSuggestion = function (entry, search, highlightedDisplay, index) {
  return <div>{entry.display}</div>
}

let startsWith = function (string, searchString, position) {
  position = position || 0
  return string.indexOf(searchString, position) === position
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

class CommentReply extends Component {
  constructor (props) {
    super(props)
    this.closeReply.bind(this)
    this.componentDidMount.bind(this)
    this.componentWillUnmount.bind(this)
    const users = Meteor.users.find({}).fetch()
    this.state = {
      value: '',
      mentions: [],
      users: users
    }
  }
  handleChange (ev, value, plainTextVal, mentions) {
    this.setState({
      value: value,
      mentions: mentions
    })
  }
  componentDidMount () {
    this.replyOpenedSubscription = EventEmitterInstance.addListener('reply-opened', () => { this.closeReply() })
  }
  componentWillUnmount () {
    if (this.replyOpenedSubscription) {
      this.replyOpenedSubscription.remove()
    }
  }
  submitReply () {
    // TODO transform mentions
    let newComment = {
      documentId: this.props.parentComment.documentId,
      text: this.state.value,
      parents: this.props.parentComment.parents,
      mentions: this.state.mentions
    }
    if (!newComment.parents) {
      newComment.parents = []
    }
    newComment.parents.push(this.props.parentComment._id)
    Meteor.call('createComment', newComment, (err, res) => {
      if (err) {
        Alert.error(err.message)
      }
      if (res) {
        Alert.success('SUCCESS: Creating comment.')
        this.props.submitReplySuccess()
      }
    })
  }
  closeReply () {
    this.props.closeReply()
  }
  render () {
    let {users} = this.state
    let possibleSuggestions = []
    users.forEach(function (user) {
      possibleSuggestions.push({id: user._id, display: user.profile.name})
    })
    return <div>
      <div className='reply-wrapper'>
        <MentionsInput appendSpaceOnAdd value={this.state.value}
          style={style} onChange={(ev, value, plainTextVal, mentions) => this.handleChange(ev, value, plainTextVal, mentions)}
          placeholder={'Mention people using \'@\''}>
          <Mention trigger='@' data={(search, callback) => throttle(data(possibleSuggestions, search, callback), 230)} style={defaultMentionStyle}
            renderSuggestion={(entry, search, highlightedDisplay, index) => renderUserSuggestion(entry, search, highlightedDisplay, index)} />
        </MentionsInput>
        <ButtonToolbar className='options-bar'>
          <Button bsStyle='success' bsSize='small' onClick={() => this.submitReply()}>Submit Reply</Button>
          <Button bsSize='small' onClick={() => this.closeReply()}>Close</Button>
        </ButtonToolbar>
        <div className='clearfix'></div>
      </div>
      <hr className='no-margin-top' />
    </div>
  }
}

CommentReply.propTypes = {
  parentComment: React.PropTypes.object,
  submitReplySuccess: React.PropTypes.func,
  closeReply: React.PropTypes.func
}

export default CommentReply
