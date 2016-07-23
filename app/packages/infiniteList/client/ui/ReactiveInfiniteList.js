import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Infinite from 'react-infinite'
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
    const { colWidth } = this.props
    return <div ref='listItem' className={'div-table-row ' + listItemClasses}>
      <div className='div-table-col' style={{width: colWidth + 'px'}}>
        List Item {this.props.name}
      </div>
      <div className='div-table-col last' style={{width: colWidth + 'px'}}>
        {this.props.count}
      </div>
    </div>
  }
}

ListItem.propTypes = {
  expanded: React.PropTypes.bool,
  name: React.PropTypes.string,
  count: React.PropTypes.number,
  colWidth: React.PropTypes.number
}

let buildElements = function (items, expandedItems, colWidth) {
  var elements = []
  items.forEach(function (item) {
    if (expandedItems.indexOf(item.name) !== -1) {
      elements.push(<ListItem key={'list-item-' + item._id} count={item._id} name={item.name} colWidth={colWidth} expanded />)
    } else {
      elements.push(<ListItem key={'list-item-' + item._id} count={item._id} name={item.name} colWidth={colWidth} expanded={false} />)
    }
  })
  return elements
}

let buildElementHeights = function (items, expandedItems) {
  var elementHeights = []
  items.forEach(function (item) {
    if (expandedItems.indexOf(item.name) !== -1) {
      elementHeights.push(100)
    } else {
      elementHeights.push(40)
    }
  })
  return elementHeights
}

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
      offsetWidth: -1,
      expandedItems: [100, 200, 300, 400, 500]
    }
  }
  componentDidMount () {
    window.addEventListener('resize', this.handleResize.bind(this))
    let element = ReactDOM.findDOMNode(this.refs.wrapper)
    this.setState({
      gotDimenstions: true,
      offsetHeight: element.offsetHeight,
      offsetWidth: element.offsetWidth
    })
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize.bind(this))
  }
  handleResize (e) {
    let element = ReactDOM.findDOMNode(this.refs.wrapper)
    this.setState({offsetHeight: element.offsetHeight, offsetWidth: element.offsetWidth})
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
    }, 0)
  }
  elementInfiniteLoad () {
    return <div className='infinite-list-item'>
      Loading...
    </div>
  }
  render () {
    let offsetWidth = this.state.offsetWidth
    let colWidth = 200
    if (offsetWidth > 0) {
      let numberOfCols = 2
      let offsetWidth = this.state.offsetWidth - 25
      colWidth = offsetWidth / numberOfCols
    }
    return (
      <div>
        <div className='infinite-example-header div-table-header'>
          <div className='div-table-col' style={{width: colWidth + 'px'}}>Name</div>
          <div className='div-table-col last' style={{width: colWidth + 'px'}}>Id</div>
          <div className='clearfix'></div>
        </div>
        <div className='div-table infinite-example' ref='wrapper'>
          {this.state.gotDimenstions ? <Infinite
            elementHeight={buildElementHeights(this.props.elements, this.state.expandedItems)}
            containerHeight={this.state.offsetHeight}
            onInfiniteLoad={() => this.handleInfiniteLoad()}
            loadingSpinnerDelegate={this.elementInfiniteLoad()}
            isInfiniteLoading={this.state.isInfiniteLoading}
            scrollContainer={this}
            infiniteLoadingBeginBottomOffset={200}
            infiniteLoadBeginEdgeOffset={20}>
            {buildElements(this.props.elements, this.state.expandedItems, colWidth)}
          </Infinite> : this.elementInfiniteLoad()}
        </div>
      </div>
    )
  }
}

ReactiveInfiniteList.propTypes = {
  elements: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(ReactiveInfiniteList)
