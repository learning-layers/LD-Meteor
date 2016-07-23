import React, {Component} from 'react'
import ReactDOM from 'react-dom'
// import Infinite from 'react-infinite'
import InfiniteAnyHeight from './InfiniteAnyHeight'
import { Meteor } from 'meteor/meteor'
import { InfiniteScrollItems } from '../../lib/collections'
import {composeWithTracker} from 'react-komposer'
import { SubsManager } from 'meteor/meteorhacks:subs-manager'
import { Session } from 'meteor/session'
import classNames from 'classnames'

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
    let listItemClasses = classNames({'infinite-list-item': true, expanded: this.props.expanded})
    return <div className={listItemClasses}>
      List Item {this.props.name} - {this.props.count}
    </div>
  }
}

ListItem.propTypes = {
  expanded: React.PropTypes.bool,
  name: React.PropTypes.string,
  count: React.PropTypes.number
}

let buildElements = function (items, expandedItems) {
  var elements = []
  items.forEach(function (item) {
    if (expandedItems.indexOf(item.name) !== -1) {
      elements.push(<ListItem key={'list-item-' + item._id} count={item._id} name={item.name} expanded />)
    } else {
      elements.push(<ListItem key={'list-item-' + item._id} count={item._id} name={item.name} expanded={false} />)
    }
  })
  return elements
}

/* let buildElementHeights = function (items, expandedItems) {
  var elementHeights = []
  items.forEach(function (item) {
    if (expandedItems.indexOf(item.name) !== -1) {
      elementHeights.push(100)
    } else {
      elementHeights.push(40)
    }
  })
  return elementHeights
}*/

class ReactiveInfiniteList extends Component {
  constructor (props) {
    super(props)
    // Meteor.call('insertInfiniteScrollTestData')
    console.debug('constructor')
    this.componentDidMount.bind(this)
    this.componentWillUnmount.bind(this)
    this.state = {
      isInfiniteLoading: false,
      gotDimenstions: false,
      offsetHeight: -1,
      expandedItems: [100, 200, 300, 400, 500]
    }
  }
  componentDidMount () {
    window.addEventListener('resize', this.handleResize.bind(this))
    let element = ReactDOM.findDOMNode(this.refs.wrapper)
    this.setState({
      gotDimenstions: true,
      offsetHeight: element.offsetHeight
    })
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize.bind(this))
  }
  handleResize (e) {
    let element = ReactDOM.findDOMNode(this.refs.wrapper)
    this.setState({offsetHeight: element.offsetHeight})
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
    // elementHeight={buildElementHeights(this.props.elements, this.state.expandedItems)}
    return (
      <div className='infinite-example' ref='wrapper'>
        {this.state.gotDimenstions ? <InfiniteAnyHeight
          containerHeight={this.state.offsetHeight}
          onInfiniteLoad={() => this.handleInfiniteLoad()}
          loadingSpinnerDelegate={this.elementInfiniteLoad()}
          isInfiniteLoading={this.state.isInfiniteLoading}
          scrollContainer={this}
          infiniteLoadingBeginBottomOffset={200}
          infiniteLoadBeginEdgeOffset={20}
          list={buildElements(this.props.elements, this.state.expandedItems)} /> : this.elementInfiniteLoad()}
      </div>
    )
  }
}

ReactiveInfiniteList.propTypes = {
  elements: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(ReactiveInfiniteList)
