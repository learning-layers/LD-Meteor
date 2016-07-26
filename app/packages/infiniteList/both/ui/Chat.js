import React, {Component} from 'react'
import Infinite from 'react-infinite'

class ListItem extends Component {
  getDefaultProps () {
    return {
      height: 50,
      lineHeight: '50px'
    }
  }
  render () {
    let style = {
      height: this.props.height,
      lineHeight: this.props.lineHeight
    }
    return <div className='infinite-list-item-chat' style={style}>
      <div style={{height: 50}}>
        List Item {this.props.index}
      </div>
    </div>
  }
}

ListItem.propTypes = {
  height: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  lineHeight: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  index: React.PropTypes.number
}

class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      elements: [],
      isInfiniteLoading: false
    }
  }
  componentDidMount () {
    setInterval(() => {
      let elemLength = this.state.elements.length
      let newElements = this.buildElements(elemLength, elemLength + 1)
      this.setState({
        elements: this.state.elements.concat(newElements)
      })
    }, 500)
  }
  buildElements (start, end) {
    var elements = []
    for (var i = start; i < end; i++) {
      elements.push(<ListItem key={i} index={i} />)
    }
    return elements
  }
  handleInfiniteLoad () {
    this.setState({
      isInfiniteLoading: true
    })
    setTimeout(() => {
      let elemLength = this.state.elements.length
      let newElements = this.buildElements(elemLength, elemLength + 20)
      this.setState({
        isInfiniteLoading: false,
        elements: newElements.concat(this.state.elements)
      })
    }, 2000)
  }
  elementInfiniteLoad () {
    return <div className='infinite-list-item-chat'>
      Loading...
    </div>
  }
  render () {
    return <Infinite elementHeight={51}
      containerHeight={400}
      infiniteLoadBeginEdgeOffset={300}
      onInfiniteLoad={() => this.handleInfiniteLoad()}
      loadingSpinnerDelegate={this.elementInfiniteLoad()}
      isInfiniteLoading={this.state.isInfiniteLoading}
      timeScrollStateLastsForAfterUserScrolls={1000}
      displayBottomUpwards>
      {this.state.elements}
    </Infinite>
  }
}

export default Chat
