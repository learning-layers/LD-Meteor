import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
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
      this.prepareToValidate = debounce(startValidation, 1000);
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

class ValidatedForm extends Component {
  constructor (props) {
    super(props)
    this.state = {value: '', price: ''}
  }
  handleChange (e) {
    this.setState({
      value: e.target.value
    })
  }
  handlePriceChange (e) {
    this.setState({
      price: e.target.value
    })
  }
  validate (state) {
    return {
      value: state.value.indexOf('react') !== -1,
      price: /^\$\d+\.\d+$/.test(state.price)
    }
  }
  render () {
    var valid = this.validate(this.state)
    return (
      <div>
        <ValidatedInput valid={valid.value}
          className='foobar'
          value={this.state.value}
          onChange={(e) => this.handleChange(e)}
          placeholder={'something with \'react\''} />
        <ValidatedInput valid={valid.price}
          value={this.state.price}
          onChange={(e) => this.handlePriceChange(e)}
          placeholder='$0.00' />
      </div>
    )
  }
}

function onPropsChange (props, onData) {
  const user = Meteor.user()
  onData(null, {user})
}

class UserProfile extends Component {
  render () {
    return (
      <div className='ld-user-profile container-fluid'>
        User Profile
        <ValidatedForm />
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(UserProfile)
