import React, {Component} from 'react'
import {Meteor} from 'meteor/meteor'
import { MentionsInput, Mention } from 'react-mentions'
import defaultStyle from './defaultStyle'
import defaultMentionStyle from './defaultMentionStyle'
import merge from 'lodash/merge'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import throttle from 'lodash/throttle'

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

class Mentions extends Component {
  constructor (props) {
    super(props)
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
  render () {
    let {users} = this.state
    let possibleSuggestions = []
    users.forEach(function (user) {
      possibleSuggestions.push({id: user._id, display: user.profile.name})
    })
    return (
      <div className='ld-notification-settings container-fluid'>
        <h1>Status Updates</h1>
        <MentionsInput appendSpaceOnAdd value={this.state.value}
          style={style} onChange={(ev, value, plainTextVal, mentions) => this.handleChange(ev, value, plainTextVal, mentions)}
          placeholder={'Mention people using \'@\''}>
          <Mention trigger='@' data={(search, callback) => throttle(data(possibleSuggestions, search, callback), 230)} style={defaultMentionStyle}
            renderSuggestion={(entry, search, highlightedDisplay, index) => renderUserSuggestion(entry, search, highlightedDisplay, index)} />
        </MentionsInput>
      </div>
    )
  }
}

export default Mentions
