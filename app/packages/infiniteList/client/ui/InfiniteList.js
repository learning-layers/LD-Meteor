import React, {Component} from 'react'
import Infinite from 'react-infinite'

class ListItem extends Component {
  render () {
    return <div className='infinite-list-item'>
      List Item {this.props.count}
    </div>
  }
}

let buildElements = function (start, end) {
  var elements = []
  for (var i = start; i < end; i++) {
    elements.push(<ListItem key={'list-item-' + i} count={i} />)
  }
  return elements
}

class InfiniteList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      elements: buildElements(0, 20),
      isInfiniteLoading: false
    }
  }
  handleInfiniteLoad () {
    this.setState({
      isInfiniteLoading: true
    })
    setTimeout(() => {
      let elemLength = this.state.elements.length
      let newElements = buildElements(elemLength, elemLength + 100)
      this.setState({
        isInfiniteLoading: false,
        elements: this.state.elements.concat(newElements)
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
