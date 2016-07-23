import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import ReactInfinite from 'react-infinite'
import merge from 'lodash/merge'

// from: https://github.com/Radivarig/react-infinite-any-height/blob/ca1191188402f44690f5ff4848ebfaed2d10c368/src/InfiniteAnyHeight.jsx
// contributed by: Reslav Hollós
// to react-infinite in issue: https://github.com/seatgeek/react-infinite/issues/61#issuecomment-228463877
// converted to es6
// LICENSE: MIT (https://github.com/Radivarig/react-infinite-any-height/blob/master/LICENSE)

class InfiniteAnyHeight extends Component {
  constructor (props) {
    super(props)
    let indexList = props.indexList || []
    let timeStamp = props.timeStamp || 0
    this.lastScrollTop = 0
    this.scrollTopDelta = 0
    console.debug(this.props)
    this.state = {
      updateHeightsOf: {indexList: indexList, timeStamp: timeStamp},
      heights: [],
      list: []
    }
  }
  getScrollContainer () {
    if (this.props.useWindowAsScrollContainer) {
      return document.body
    }
    return this.props.scrollContainer
  }
  addHeight (i, height) {
    var heights = this.state.heights
    var scrollDiff = height - heights[i]
    if (scrollDiff && this.scrollTopDelta < 0) {
      this.getScrollContainer().scrollTop += scrollDiff
    }
    heights[i] = height
    this.setState({heights})
  }
  componentDidMount () {
    this.setList(this.props.list)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.list !== this.props.list) {
      this.setList(nextProps.list)
    }

    let indexList = nextProps.indexList || []
    let timeStamp = nextProps.timeStamp || 0
    nextProps = merge({updateHeightsOf: {indexList: indexList, timeStamp: timeStamp}}, nextProps)

    if (nextProps.updateHeightsOf.timeStamp !== this.state.updateHeightsOf.timeStamp) {
      this.remountByIndices(nextProps.updateHeightsOf.indexList, nextProps.list)
    }
    this.state.updateHeightsOf = nextProps.updateHeightsOf
  }
  remountByIndices (indices, origList) {
    var list = this.state.list
    for (var i = 0; i < indices.length; ++i) {
      var ind = indices[i]
      var elem = origList[ind]
      list[ind] = this.getGetHeightWrapper(elem, ind + '_' + new Date().getTime())
    }
    this.setState({list})
  }
  getGetHeightWrapper (propsListItem, i) {
    return (
      <GetHeightWrapper
        addHeight={this.addHeight.bind(this, i)}
        key={i}
      >
      {propsListItem}
      </GetHeightWrapper>
    )
  }
  setList (propsList) {
    var heights = []
    var list = propsList.map((propsListItem, i) => {
      heights[i] = this.state.heights[i] || 200
      return this.getGetHeightWrapper(propsListItem, i)
    })
    this.setState({
      heights,
      list
    })
  }
  handleScroll () {
    // TODO check if this is working correctly in new versions of react-infinite
    // var scrollTop = this.getScrollContainer().scrollTop
    // this.scrollTopDelta = scrollTop - this.lastScrollTop
    // this.lastScrollTop = scrollTop
  }
  render () {
    return (
      <ReactInfinite
        elementHeight={this.state.heights}
        handleScroll={() => this.handleScroll()}
        {...this.props}
        >
        {this.state.list}
      </ReactInfinite>
    )
  }
}

InfiniteAnyHeight.propTypes = {
  useWindowAsScrollContainer: React.PropTypes.bool,
  scrollContainer: React.PropTypes.object,
  list: React.PropTypes.array,
  indexList: React.PropTypes.array,
  timeStamp: React.PropTypes.number,
  updateHeightsOf: React.PropTypes.object
}

class GetHeightWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      height: undefined
    }
  }
  componentDidMount () {
    this.setHeight()
  }
  setHeight () {
    var height = ReactDOM.findDOMNode(this).getBoundingClientRect().height
    this.props.addHeight(height)
  }
  render () {
    var s = {
      content: '&nbsp;',
      display: 'block',
      clear: 'both'
    }
    return (
      <span style={s} className={this.state.height + '-px'}>
        {this.props.children}
      </span>
    )
  }
}

GetHeightWrapper.propTypes = {
  addHeight: React.PropTypes.func,
  children: React.PropTypes.object
}

export default InfiniteAnyHeight
