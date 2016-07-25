import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Infinite from 'react-infinite'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

let buildElements = function (ListItemComponent, items, expandedItems, colWidth) {
  var elements = []
  if (items) {
    items.forEach(function (item) {
      if (expandedItems.indexOf(item._id) !== -1) {
        elements.push(<ListItemComponent key={'list-item-' + item._id} item={item} colWidth={colWidth} expanded />)
      } else {
        elements.push(<ListItemComponent key={'list-item-' + item._id} item={item} colWidth={colWidth} expanded={false} />)
      }
    })
  }
  return elements
}

let buildElementHeights = function (items, expandedItems, normalHeight, expandedHeight) {
  var elementHeights = []
  if (items) {
    items.forEach(function (item) {
      if (expandedItems.indexOf(item._id) !== -1) {
        elementHeights.push(expandedHeight)
      } else {
        elementHeights.push(normalHeight)
      }
    })
  }
  return elementHeights
}

class ReactiveInfiniteList extends Component {
  constructor (props) {
    super(props)
    this.componentDidMount.bind(this)
    this.componentWillUnmount.bind(this)
    this.state = {
      isInfiniteLoading: false,
      gotDimenstions: false,
      offsetHeight: -1,
      offsetWidth: -1
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
    if (this.refs.wrapper) {
      let element = ReactDOM.findDOMNode(this.refs.wrapper)
      this.setState({offsetHeight: element.offsetHeight, offsetWidth: element.offsetWidth})
    }
  }
  handleInfiniteLoad () {
    this.setState({
      isInfiniteLoading: true
    })
    setTimeout(() => {
      if (this.props.items) {
        let itemsLength = this.props.items.length
        Session.set(this.props.subsLimitSessionVarName, itemsLength + 100)
        let subsName = this.props.subsName.substring(0, 1).toUpperCase() + this.props.subsName.substring(1, this.props.subsName.length)
        let argsObj = {limit: itemsLength + 100}
        argsObj.additionalMethodArgs = this.props.additionalMethodArgs
        Meteor.call('setArgs' + subsName, argsObj, (err, res) => {
          // TODO check error cases here
          if (err) {
            //
          }
          if (res) {
            this.setState({
              isInfiniteLoading: false
            })
          }
        })
      }
    }, 0)
  }
  elementInfiniteLoad () {
    return <div className='infinite-list-item'>
      Loading...
    </div>
  }
  render () {
    const { ListItemComponent, items, headerLabels, expandedItems, normalHeight, expandedHeight } = this.props
    let headerLabelsLength = headerLabels.length
    let offsetWidth = this.state.offsetWidth
    let colWidth = 200
    if (offsetWidth > 0) {
      let numberOfCols = headerLabelsLength
      let offsetWidth = this.state.offsetWidth - 25
      colWidth = offsetWidth / numberOfCols
    }
    return (
      <div>
        <div className='infinite-example-header div-table-header'>
          {headerLabels.map(function (headerLabel, i) {
            if (i + 1 === headerLabelsLength) {
              return <div className='div-table-col last' style={{width: colWidth + 'px'}}>{headerLabel}</div>
            } else {
              return <div className='div-table-col' style={{width: colWidth + 'px'}}>{headerLabel}</div>
            }
          })}
          <div className='clearfix'></div>
        </div>
        <div className='div-table infinite-example' ref='wrapper'>
          {this.state.gotDimenstions ? <Infinite
            elementHeight={buildElementHeights(items, expandedItems, normalHeight, expandedHeight)}
            containerHeight={this.state.offsetHeight}
            onInfiniteLoad={() => this.handleInfiniteLoad()}
            loadingSpinnerDelegate={this.elementInfiniteLoad()}
            isInfiniteLoading={this.state.isInfiniteLoading}
            scrollContainer={this}
            infiniteLoadingBeginBottomOffset={200}
            infiniteLoadBeginEdgeOffset={20}>
            {buildElements(ListItemComponent, items, expandedItems, colWidth)}
          </Infinite> : this.elementInfiniteLoad()}
        </div>
      </div>
    )
  }
}

ReactiveInfiniteList.propTypes = {
  additionalMethodArgs: React.PropTypes.array,
  normalHeight: React.PropTypes.number.isRequired,
  expandedHeight: React.PropTypes.number.isRequired,
  expandedItems: React.PropTypes.array.isRequired,
  items: React.PropTypes.array.isRequired,
  ListItemComponent: React.PropTypes.func.isRequired,
  subsName: React.PropTypes.string.isRequired,
  subsLimitSessionVarName: React.PropTypes.string.isRequired,
  headerLabels: React.PropTypes.array.isRequired
}

export default ReactiveInfiniteList
