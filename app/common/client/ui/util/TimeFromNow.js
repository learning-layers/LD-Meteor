import React, {Component} from 'react'
import { moment } from 'meteor/momentjs:moment'

export class TimeFromNow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshInterval: null
    }
  }
  componentDidMount () {
    this.state.refreshInterval = setInterval(() => {
      this.setState({})
    }, 61 * 1000)
  }
  componentWillUnmount () {
    if (this.state.refreshInterval !== null) {
      clearInterval(this.state.refreshInterval)
    }
  }
  render () {
    return <span>{moment.max(moment(this.props.date).fromNow())}</span>
  }
}
