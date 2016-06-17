import React, { Component } from 'react'
import ReactiveInfiniteList from '../../../infiniteList/client/ui/ReactiveInfiniteList'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { Documents } from '../../lib/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('documentList')
  if (handle.ready()) {
    let documents = Documents.find({createdBy: Meteor.userId()}).fetch()
    onData(null, {documents})
  }
}

class DocumentList extends Component {
  render () {
    const { documents } = this.props
    return <div className='document-list'>
      {documents.map(function (document) {
        return <div className='document'>{document.title}</div>
      })}
      <ReactiveInfiniteList />
    </div>
  }
}

export default composeWithTracker(onPropsChange)(DocumentList)
