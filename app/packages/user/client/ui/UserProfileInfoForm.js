import React, { Component } from 'react'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import ControlLabel from '../../../../../node_modules/react-bootstrap/lib/ControlLabel'
import FormControl from '../../../../../node_modules/react-bootstrap/lib/FormControl'
import { Meteor } from 'meteor/meteor'
import ValidatedFormControl from './ValidatedFormControl'
import { Match } from 'meteor/check'

class UserProfileInfoForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      displayName: ''
    }
  }
  handleChangeDisplayName (e) {
    this.setState({
      displayName: e.target.value
    })
  }
  validate (state) {
    return {
      displayName: Match.test({displayName: state.displayName}, this.props.schema.pick(['displayName']))
    }
  }
  render () {
    const { userId, schema } = this.props
    const isOwnProfile = userId === Meteor.userId()
    var valid = this.validate(this.state)
    return <form>
      {isOwnProfile ? <FormGroup controlId='userDescriptionTextArea'>
        <ControlLabel>Change Displayname</ControlLabel>
        <ValidatedFormControl valid={valid.displayName}
          value={this.state.displayName}
          onChange={(e) => this.handleChangeDisplayName(e)}
          placeholder={schema._schema.displayName.placeholder}
          disabled={!isOwnProfile} />
      </FormGroup> : null}
      <FormGroup controlId='userFullNameText'>
        <ControlLabel>Full Name</ControlLabel>
        <FormControl type='text' placeholder='Enter Full Name...' disabled={!isOwnProfile} />
      </FormGroup>
      <FormGroup controlId='userDescriptionTextArea'>
        <ControlLabel>Description</ControlLabel>
        <FormControl type='textarea' placeholder='Enter Description...' disabled={!isOwnProfile} />
      </FormGroup>
      <button className='btn btn-info'>Submit</button>
    </form>
  }
}

export default UserProfileInfoForm
