import React, {Component} from 'react'
import Infinite from 'react-infinite'
import { Meteor } from 'meteor/meteor'
import { InfiniteScrollItems } from '../../lib/collections'
import {composeWithTracker} from 'react-komposer'
import { SubsManager } from 'meteor/meteorhacks:subs-manager'
import { Session } from 'meteor/session'

let InfiniteScrollItemsSubs = new SubsManager()
let initialLimit = 20
Session.setDefault('initialLimit', initialLimit)

function onPropsChange (props, onData) {
  let handle = InfiniteScrollItemsSubs.subscribe('reactiveInfiniteItems', {itemId: 'test', limit: initialLimit})
  if (handle.ready()) {
    let elements = InfiniteScrollItems.find({}, { limit: Session.get('initialLimit') }).fetch()
    onData(null, {elements})
  }
  return () => { Session.set('initialLimit', 20) }
}

class ListItem extends Component {
  render () {
    return <div className='infinite-list-item'>
      List Item {this.props.name} - {this.props.count}
    </div>
  }
}

let buildElements = function (items) {
  var elements = []
  items.forEach(function (item) {
    elements.push(<ListItem key={'list-item-' + item._id} count={item._id} name={item.name} />)
  })
  return elements
}

class ReactiveInfiniteList extends Component {
  constructor (props) {
    super(props)
    console.debug('constructor')
    this.state = {
      isInfiniteLoading: false
    }
  }
  handleInfiniteLoad () {
    this.setState({
      isInfiniteLoading: true
    })
    setTimeout(() => {
      let elemLength = this.props.elements.length
      Session.set('initialLimit', elemLength + 100)
      Meteor.call('setArgs', {itemId: 'test', limit: elemLength + 100}, (err, res) => {
        if (err) {
          //
        }
        if (res) {
          this.setState({
            isInfiniteLoading: false
          })
        }
      })
    }, 400)
  }
  elementInfiniteLoad () {
    return <div className='infinite-list-item'>
      Loading...
    </div>
  }
  render () {
    return (
      <div className='infinite-example'>
        <Infinite elementHeight={40}
          containerHeight={250}
          infiniteLoadingBeginBottomOffset={200}
          onInfiniteLoad={() => this.handleInfiniteLoad()}
          loadingSpinnerDelegate={this.elementInfiniteLoad()}
          isInfiniteLoading={this.state.isInfiniteLoading}
          infiniteLoadBeginEdgeOffset={20}>
          {buildElements(this.props.elements)}
        </Infinite>
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(ReactiveInfiniteList)
