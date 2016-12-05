import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {compose} from 'react-komposer'
import {Meteor} from 'meteor/meteor'
import { Tests } from '../../lib/collections'
import { insertNewTestItem } from '../../lib/methods'
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
  let handle = Meteor.subscribe('testData')
  if (handle.ready()) {
    let tests = Tests.find({}).fetch()
    onData(null, {tests})
  }
}

// @see https://medium.com/meteor-js/client-side-aes-encryption-with-meteor-3be8d645fc12#.pa3zzajms
class EncryptionTest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newItemInputValue: ''
    }
  }
  handleNewItemChange (event) {
    this.setState({newItemInputValue: event.target.value})
  }
  addNewTestItem () {
    let newTestItemValue = ReactDOM.findDOMNode(this.refs.newItem).value
    insertNewTestItem({data: newTestItemValue})
  }
  render () {
    const {tests} = this.props
    return (
      <div>
        <input ref='newItem' className='form-control' placeholder='new encrypted test item' onChange={(event) => this.handleNewItemChange(event)} value={this.state.newItemInputValue} />
        <button className='btn btn-success' onClick={() => this.addNewTestItem()}>Add new encrypted test item</button>
        {tests.length > 0 ? <ul className='ld-testlist'>
          {tests.map(function (test) {
            console.log(test)
            if (test.valid === false) {
              return null // filter out invalid items
            }
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

EncryptionTest.propTypes = {
  tests: React.PropTypes.array
}

export default compose(getTrackerLoader(onPropsChange))(EncryptionTest)
