import React, {Component} from 'react'
import { MentionsInput, Mention } from 'react-mentions'
import throttle from 'lodash/throttle'
import merge from 'lodash/merge'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import { Meteor } from 'meteor/meteor'
import defaultStyle from '../defaultStyle'
import defaultMentionStyle from '../defaultMentionStyle'

let startsWith = function (string, searchString, position) {
  position = position || 0
  return string.indexOf(searchString, position) === position
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

const style = merge({}, defaultStyle(), {
  suggestions: {
    list: {
      maxHeight: 100,
      overflow: 'auto'
    }
  }
})

class CommentContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.text,
      mentions: []
    }
  }
  handleChange (ev, value, plainTextVal, mentions) {
    this.setState({
      value: value,
      mentions: mentions
    })
  }
  render () {
    return <MentionsInput appendSpaceOnAdd value={this.state.value}
      style={style} onChange={(ev, value, plainTextVal, mentions) => this.handleChange(ev, value, plainTextVal, mentions)}
      placeholder={'Mention people using \'@\''}
      disabled={!this.props.editMode}>
      <Mention trigger='@' data={(search, callback) => throttle(data([], search, callback), 230)} style={defaultMentionStyle}
        renderSuggestion={(entry, search, highlightedDisplay, index) => renderUserSuggestion(entry, search, highlightedDisplay, index)} />
    </MentionsInput>
  }
}

CommentContent.propTypes = {
  text: React.PropTypes.string,
  editMode: React.PropTypes.bool
}

export default CommentContent
