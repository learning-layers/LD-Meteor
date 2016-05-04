import React, {Component} from 'react'
import {composeWithTracker} from 'react-komposer'
import {Meteor} from 'meteor/meteor'
import { Tests } from '../../lib/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('testData')
  if (handle.ready()) {
    let tests = Tests.find({}).fetch()
    onData(null, {tests})
  }
}

// @see https://medium.com/meteor-js/client-side-aes-encryption-with-meteor-3be8d645fc12#.pa3zzajms
class EncryptionTest extends Component {
  render () {
    const {tests} = this.props
    return (
      <div>
        {tests.length > 0 ? <ul className='ld-testlist'>
            {tests.map(function (test) {
              return <li key={'test-' + test._id}>
                {test.data}
              </li>
            })}
        </ul> : <ul className='ld-testlist'>
          <li>'Nothing to display'</li>
        </ul>}
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(EncryptionTest)
