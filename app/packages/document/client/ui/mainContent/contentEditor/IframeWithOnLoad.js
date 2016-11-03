import React, {Component} from 'react'
import ReactDOM from 'react-dom'

class IFrameWithOnLoad extends Component {
  constructor (props) {
    super(props)
    this.state = {
      onLoad: props.onLoaded
    }
  }
  componentWillReceiveProps (nextProps) {
    try {
      ReactDOM.findDOMNode(this.refs.iframe).removeEventListener('load', this.state.onLoad)
    } catch (e) {
      //
    }
    this.setState({
      onLoad: nextProps.onLoaded
    })
    ReactDOM.findDOMNode(this.refs.iframe).addEventListener('load', this.state.onLoad)
  }
  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.iframe).addEventListener('load', this.state.onLoad)
  }
  componentWillUnmount () {
    ReactDOM.findDOMNode(this.refs.iframe).removeEventListener('load', this.state.onLoad)
  }
  render () {
    return <iframe ref='iframe' {...this.props} />
  }
}

IFrameWithOnLoad.propTypes = {
  src: React.PropTypes.string.isRequired,
  onLoaded: React.PropTypes.func
}

export default IFrameWithOnLoad
