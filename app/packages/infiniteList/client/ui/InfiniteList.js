import React, {Component} from 'react'
import Infinite from 'react-infinite'
import { Meteor } from 'meteor/meteor'
import { InfiniteScrollItems } from '../../lib/collections'

class ListItem extends Component {
  render () {
    return <div className='infinite-list-item'>
      List Item {this.props.count}
    </div>
  }
}

let buildElements = function (items) {
  var elements = []
  items.forEach(function (item) {
    elements.push(<ListItem key={'list-item-' + item._id} count={item._id} />)
  })
  return elements
}

class InfiniteList extends Component {
  constructor (props) {
    super(props)
    Meteor.call('insertInfiniteScrollTestData')
    let initialLimit = 20
    let initialItems = InfiniteScrollItems.find({}, { limit: initialLimit }).fetch()
    console.debug(initialItems)
    this.state = {
      limit: initialLimit,
      elements: buildElements(initialItems),
      isInfiniteLoading: false
    }
  }
  handleInfiniteLoad () {
    this.setState({
      isInfiniteLoading: true
    })
    setTimeout(() => {
      let elemLength = this.state.elements.length
      Meteor.call('getItems', elemLength, 100, (err, newElements) => {
        if (err) {
          //
        }
        this.setState({
          isInfiniteLoading: false,
          elements: this.state.elements.concat(buildElements(newElements))
        })
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
          {this.state.elements}
        </Infinite>
      </div>
    )
  }
}

export default InfiniteList
