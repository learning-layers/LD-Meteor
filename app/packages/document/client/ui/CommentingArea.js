import React, {Component} from 'react'
import { composeWithTracker } from 'react-komposer'
import Comment from './Comment'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import DropdownButton from '../../../../../node_modules/react-bootstrap/lib/DropdownButton'
import MenuItem from '../../../../../node_modules/react-bootstrap/lib/MenuItem'
import { MentionsInput, Mention } from 'react-mentions'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import merge from 'lodash/merge'
import throttle from 'lodash/throttle'
import defaultStyle from './defaultStyle'
import defaultMentionStyle from './defaultMentionStyle'
import { Meteor } from 'meteor/meteor'
import { DocumentComments } from '../../lib/collections'
import { Counts } from 'meteor/tmeasday:publish-counts'

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

function onPropsChange (props, onData) {
  let commentsHandle = Meteor.subscribe('documentComments', {documentId: props.documentId})
  let commentsCounterHandle = Meteor.subscribe('documentCommentsCount', {documentId: props.documentId})
  if (commentsHandle.ready() && commentsCounterHandle.ready()) {
    let documentComments = DocumentComments.find({'documentId': props.documentId}).fetch()
    let documentCommentsCount = Counts.get('documentCommentsCount')
    onData(null, {documentComments, documentCommentsCount})
  }
}

class CommentingArea extends Component {
  constructor (props) {
    super(props)
    const users = Meteor.users.find({}).fetch()
    this.state = {
      value: '',
      mentions: [],
      users: users
    }
  }
  createNewComment () {
    Meteor.call('createComment', {
      documentId: this.props.documentId,
      text: 'BulletProof Meteor is great!',
      parents: null
    })
  }
  handleChange (ev, value, plainTextVal, mentions) {
    this.setState({
      value: value,
      mentions: mentions
    })
  }
  render () {
    let {users} = this.state
    let possibleSuggestions = []
    users.forEach(function (user) {
      possibleSuggestions.push({id: user._id, display: user.profile.name})
    })
    const { documentComments, documentCommentsCount } = this.props
    return <div class='commenting-section'>
      <div className='create-new-comment-wrapper'>
        <MentionsInput appendSpaceOnAdd value={this.state.value}
          style={style} onChange={(ev, value, plainTextVal, mentions) => this.handleChange(ev, value, plainTextVal, mentions)}
          placeholder={'Mention people using \'@\''}>
          <Mention trigger='@' data={(search, callback) => throttle(data(possibleSuggestions, search, callback), 230)} style={defaultMentionStyle}
            renderSuggestion={(entry, search, highlightedDisplay, index) => renderUserSuggestion(entry, search, highlightedDisplay, index)} />
        </MentionsInput>
        <ButtonToolbar className='options-bar'>
          <Button bsStyle='success' bsSize='small' onClick={() => this.createNewComment()}>Submit Reply</Button>
          <Button bsSize='small' onClick={() => this.closeReply()}>Close</Button>
        </ButtonToolbar>
        <div className='clearfix'></div>
      </div>
      <div className='commenting-section-comments'>
        <div className='commenting-header'>
          <h4>Comments ({documentCommentsCount})</h4>
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
        {documentComments.map(function (documentComment) {
          return <Comment key={'dc-' + documentComment._id} comment={documentComment} />
        })}
      </div>
    </div>
  }
}

export default composeWithTracker(onPropsChange)(CommentingArea)
