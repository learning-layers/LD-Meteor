import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { Documents } from '../../lib/collections'
import { composeWithTracker } from 'react-komposer'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('document', {id: props.id})
  if (handle.ready()) {
    let document = Documents.findOne({'_id': props.id})
    onData(null, {document})
  }
}

class Document extends Component {
  render () {
    const { document } = this.props
    return <div class='document'>
      {document.title}
    </div>
  }
}

export default composeWithTracker(onPropsChange)(Document)
