import React, { Component } from 'react'
import debounce from 'lodash/debounce'

class ValidatedInput extends Component {
  constructor (props) {
    super(props)
    this.state = {validationStarted: false}
    this.componentWillMount.bind(this)
    this.handleChange.bind(this)
  }
  prepareToValidate () {}
  componentWillMount () {
    var startValidation = () => {
      this.setState({
        validationStarted: true
      })
    }
    // if non-blank value: validate now
    if (this.props.value) {
      startValidation()
    } else {
      // wait until the user starts typing, and then stops
      this.prepareToValidate = debounce(startValidation, 1000)
    }
  }
  handleChange (e) {
    if (!this.state.validationStarted) {
      this.prepareToValidate()
    }
    this.props.onChange && this.props.onChange(e)
  }
  render () {
    var className = ''
    if (this.state.validationStarted) {
      className = (this.props.valid ? 'valid' : 'invalid')
    }
    return (
      <input
        {...this.props}
        className={className}
        onChange={(e) => this.handleChange(e)} />
    )
  }
}

export default ValidatedInput
