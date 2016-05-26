import React, {Component} from 'react'
import {composeWithTracker} from 'react-komposer'
import {Meteor} from 'meteor/meteor'
import { SearchItems } from '../../lib/collections'
import { Session } from 'meteor/session'
import ReactDom from 'react-dom'

Session.setDefault('search', '')

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('search', {search: Session.get('search'), language: 'de'})
  if (handle.ready()) {
    let searchItems = SearchItems.find({}).fetch()
    onData(null, {searchItems})
  }
}

let highlightText = function (sectionToHighlight, text) {
  if (sectionToHighlight !== '') {
    let splittedText = text.split(sectionToHighlight)
    let count = 0
    return <span>
      {splittedText.map(function (textPart) {
        if (count === 0) {
          count++
          return <span>{textPart}</span>
        } else {
          return <span><span className='highlighted'>{sectionToHighlight}</span>{textPart}</span>
        }
      })}
    </span>
  } else {
    return <span>{text}</span>
  }
}

class Search extends Component {
  constructor (props) {
    super(props)
    Session.set('search', '')
  }
  handleSearchInputChange (event) {
    console.log('searchInputChange')
    let searchString = ReactDom.findDOMNode(event.target).value
    searchString = searchString.replace(/\u0061\b/ig, '')
    Session.set('search', searchString)
  }
  render () {
    const {searchItems} = this.props
    return (
      <div className='ld-search'>
        <input type='text' onChange={(event) => this.handleSearchInputChange(event)} placeholder='Find...' />
        <ul>
          {searchItems.map(function (searchItem) {
            return <li key={'searchItem-' + searchItem._id}>
              {highlightText(Session.get('search'), searchItem.text)}
            </li>
          })}
        </ul>
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(Search)
