import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import ReactMarkdown from 'react-markdown'
import { AppVars } from '../../../../common/lib/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('legalNotice')
  if (handle.ready()) {
    const user = Meteor.user()
    const legalNotice = AppVars.findOne({'name': 'legalNotice'})
    onData(null, { user, legalNotice })
  }
}

class LegalNotice extends Component {
  render () {
    const input = '# This is a header\n\nAnd this is a paragraph'
    // const { user, legalNotice } = this.props
    return <div id='legal-notice' className='container'>
      Legal Notice
      <ReactMarkdown source={input} />
    </div>
  }
}

export default composeWithTracker(onPropsChange)(LegalNotice)
