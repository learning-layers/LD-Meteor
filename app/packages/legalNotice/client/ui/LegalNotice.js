import React, { Component } from 'react'
import { compose } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import ReactMarkdown from 'react-markdown'
import { AppVars } from '../../../../common/lib/collections'
import { Tracker } from 'meteor/tracker'

function getTrackerLoader (reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env)
      })
    })

    return () => {
      if (typeof trackerCleanup === 'function') trackerCleanup()
      return handler.stop()
    }
  }
}

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

export default compose(getTrackerLoader(onPropsChange))(LegalNotice)
