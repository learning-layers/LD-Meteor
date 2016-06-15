import React, { Component } from 'react'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import ControlLabel from '../../../../../node_modules/react-bootstrap/lib/ControlLabel'
import { Meteor } from 'meteor/meteor'
import ValidatedFormControl from './ValidatedFormControl'
import { Match } from 'meteor/check'
import Alert from 'react-s-alert'

class UserProfileInfoForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      displayName: props.user.profile.name || '',
      fullName: props.user.profile.fullName || '',
      description: props.user.profile.description || ''
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      displayName: nextProps.user.profile.name || '',
      fullName: nextProps.user.profile.fullName || '',
      description: nextProps.user.profile.description || ''
    })
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
      description: Match.test({description: state.description}, this.props.schema.pick(['description'])),
      all: Match.test(this.state, this.props.schema)
    }
  }
  handleSubmit (e) {
    e.preventDefault()
    console.log('Submitted=' + JSON.stringify(this.state))
    if (this.validate(this.state)) {
      Meteor.call('sendNewProfileInfoData', this.state.displayName, this.state.fullName, this.state.description, function (error, result) {
        if (error) {
          if (error.message) {
            Alert.error(error.message)
          } else {
            Alert.error('Error: Changing profile information failed.')
          }
        }
        if (result) {
          Alert.success('Success: Changing profile information was successful.')
        }
      })
    }
  }
  render () {
    const { user, schema } = this.props
    const isOwnProfile = user._id === Meteor.userId()
    var valid = this.validate(this.state)
    return <form onSubmit={(e) => this.handleSubmit(e)}>
      {isOwnProfile ? <FormGroup controlId='userDescriptionTextArea'>
        <ControlLabel>{schema._schema.displayName.label}</ControlLabel>
        <ValidatedFormControl
          ref='displayName'
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
          ref='fullName'
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
          ref='description'
          type='text'
          valid={valid.description}
          value={this.state.description}
          onChange={(e) => this.handleChangeDescription(e)}
          placeholder={schema._schema.description.placeholder}
          disabled={!isOwnProfile} />
      </FormGroup>
      {isOwnProfile ? <button className='btn btn-info' disabled={!valid.all}>Submit</button> : null}
    </form>
  }
}

export default UserProfileInfoForm
