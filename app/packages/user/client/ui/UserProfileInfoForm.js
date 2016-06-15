import React, { Component } from 'react'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import ControlLabel from '../../../../../node_modules/react-bootstrap/lib/ControlLabel'
import { Meteor } from 'meteor/meteor'
import ValidatedFormControl from './ValidatedFormControl'
import { Match } from 'meteor/check'

class UserProfileInfoForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      displayName: '',
      fullName: '',
      description: ''
    }
  }
  handleChangeDisplayName (e) {
    this.setState({
      displayName: e.target.value
    })
  }
  handleChangeFullName (e) {
    this.setState({
      fullName: e.target.value
    })
  }
  handleChangeDescription (e) {
    this.setState({
      description: e.target.value
    })
  }
  validate (state) {
    return {
      displayName: Match.test({displayName: state.displayName}, this.props.schema.pick(['displayName'])),
      fullName: Match.test({fullName: state.fullName}, this.props.schema.pick(['fullName'])),
      description: Match.test({description: state.description}, this.props.schema.pick(['description']))
    }
  }
  render () {
    const { userId, schema } = this.props
    const isOwnProfile = userId === Meteor.userId()
    var valid = this.validate(this.state)
    return <form>
      {isOwnProfile ? <FormGroup controlId='userDescriptionTextArea'>
        <ControlLabel>{schema._schema.displayName.label}</ControlLabel>
        <ValidatedFormControl
          type='text'
          valid={valid.displayName}
          value={this.state.displayName}
          onChange={(e) => this.handleChangeDisplayName(e)}
          placeholder={schema._schema.displayName.placeholder}
          disabled={!isOwnProfile} />
      </FormGroup> : null}
      <FormGroup controlId='userFullNameText'>
        <ControlLabel>{schema._schema.fullName.label}</ControlLabel>
        <ValidatedFormControl
          type='text'
          valid={valid.fullName}
          value={this.state.fullName}
          onChange={(e) => this.handleChangeFullName(e)}
          placeholder={schema._schema.fullName.placeholder}
          disabled={!isOwnProfile} />
      </FormGroup>
      <FormGroup controlId='userDescriptionTextArea'>
        <ControlLabel>{schema._schema.description.label}</ControlLabel>
        <ValidatedFormControl
          type='text'
          valid={valid.description}
          value={this.state.description}
          onChange={(e) => this.handleChangeDescription(e)}
          placeholder={schema._schema.description.placeholder}
          disabled={!isOwnProfile} />
      </FormGroup>
      <button className='btn btn-info'>Submit</button>
    </form>
  }
}

export default UserProfileInfoForm
