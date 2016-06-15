import React, { Component } from 'react'
import { Match } from 'meteor/check'
import ValidatedInput from './ValidatedInput'

class ValidatedForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      price: ''
    }
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
      name: Match.test({name: state.value}, this.props.schema.pick(['name'])),
      price: Match.test({price: state.price}, this.props.schema.pick(['price']))
    }
  }
  render () {
    var valid = this.validate(this.state)
    const {schema} = this.props
    return (
      <div>
        <ValidatedInput valid={valid.name}
          className='foobar'
          value={this.state.value}
          onChange={(e) => this.handleChange(e)}
          placeholder={schema._schema.name.placeholder} />
        <ValidatedInput valid={valid.price}
          value={this.state.price}
          onChange={(e) => this.handlePriceChange(e)}
          placeholder={schema._schema.price.placeholder} />
      </div>
    )
  }
}

export default ValidatedForm
