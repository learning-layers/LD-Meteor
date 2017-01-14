import React, {Component, PropTypes} from 'react'
import { Meteor } from 'meteor/meteor'
import { MentionsInput, Mention } from 'react-mentions'
import throttle from 'lodash/throttle'
import _uniqBy from 'lodash/uniqBy'
import _sortBy from 'lodash/sortBy'
import merge from 'lodash/merge'
import defaultStyle from '../defaultStyle'
import defaultMentionStyle from '../defaultMentionStyle'
import ButtonToolbar from '../../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../../node_modules/react-bootstrap/lib/Button'

MentionsInput.propTypes.appendSpaceOnAdd = PropTypes.bool

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
      suggestions = _uniqBy(filteredPossibleSuggestions.concat(suggestions), 'id')
      suggestions = _sortBy(suggestions, 'display')
      callback(suggestions)
    }
  })
}

class CreateNewComment extends Component {
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
    // TODO transform mentions
    Meteor.call('createComment', {
      documentId: this.props.documentId,
      text: this.state.value,
      parents: null,
      mentions: this.state.mentions
    })
    this.setState({
      value: '',
      mentions: []
    })
  }
  handleChange (ev, value, plainTextVal, mentions) {
    this.setState({
      value: value,
      mentions: mentions
    })
  }
  closeReply () {
    this.setState({
      value: '',
      mentions: []
    })
  }
  render () {
    let {users} = this.state
    let possibleSuggestions = []
    users.forEach(function (user) {
      possibleSuggestions.push({id: user._id, display: user.profile.name})
    })
    return <div className='create-new-comment-wrapper'>
      <MentionsInput appendSpaceOnAdd value={this.state.value}
        style={style} onChange={(ev, value, plainTextVal, mentions) => this.handleChange(ev, value, plainTextVal, mentions)}
        placeholder={'Mention people using \'@\''}>
        <Mention trigger='@' data={(search, callback) => throttle(data(possibleSuggestions, search, callback), 230)} style={defaultMentionStyle}
          renderSuggestion={(entry, search, highlightedDisplay, index) => renderUserSuggestion(entry, search, highlightedDisplay, index)} />
      </MentionsInput>
      <ButtonToolbar className='options-bar'>
        <Button bsStyle='success' bsSize='small' onClick={() => this.createNewComment()}>Submit Comment</Button>
        <Button bsSize='small' onClick={() => this.closeReply()}>Cancel</Button>
      </ButtonToolbar>
      <div className='clearfix' />
    </div>
  }
}

CreateNewComment.propTypes = {
  documentId: React.PropTypes.string
}

export default CreateNewComment
