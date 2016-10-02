import React, { Component } from 'react'
import FormControl from '../../../../../node_modules/react-bootstrap/lib/FormControl'
import ControlLabel from '../../../../../node_modules/react-bootstrap/lib/ControlLabel'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import debounce from 'lodash/debounce'
import { Match } from 'meteor/check'
import { GroupChatTopicSchema } from '../../lib/schema'
import { Meteor } from 'meteor/meteor'
import Alert from 'react-s-alert'

class CreateNewChatTopicForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      validationStarted: false
    }
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
  handleNameChange (e) {
    this.setState({ name: e.target.value })
    if (!this.state.validationStarted) {
      this.prepareToValidate()
    }
  }
  validate (state) {
    const cleanState = this.createCleanState()
    return {
      name: Match.test({name: state.name}, GroupChatTopicSchema.pick(['name'])),
      all: Match.test(cleanState, GroupChatTopicSchema)
    }
  }
  createCleanState () {
    const cleanState = JSON.parse(JSON.stringify(this.state))
    delete cleanState.validationStarted
    cleanState.groupId = this.props.groupId
    cleanState.participants = []
    return cleanState
  }
  submit (e) {
    e.preventDefault()
    const valid = this.validate(this.state)
    if (valid.all) {
      const cleanState = this.createCleanState()
      Meteor.call('createGroupChatTopic', cleanState, (error, result) => {
        if (error) {
          if (error.message) {
            Alert.error(error.message)
          } else {
            Alert.error('Error: Creating new chat topic.')
          }
        }
        if (result) {
          this.props.closeModalFunc()
          Alert.success('Success: Creating chat topic.')
          Meteor.setTimeout(() => {
            this.setState({
              name: '',
              validationStarted: false
            })
          }, 230)
        }
      })
    }
  }
  render () {
    // TODO insert <HelpBlock>Validation is based on string length.</HelpBlock> to show validation errors
    const valid = this.validate(this.state)
    return <form className='create-new-chat-topic' onSubmit={(e) => this.submit(e)}>
      <FormGroup
        controlId='formBasicText'
        validationState={this.state.validationStarted ? (valid.name ? 'success' : 'error') : ''}
      >
        <ControlLabel>{GroupChatTopicSchema._schema.name.label}</ControlLabel>
        <FormControl
          type='text'
          value={this.state.name}
          placeholder={GroupChatTopicSchema._schema.name.placeholder}
          onChange={(e) => this.handleNameChange(e)}
          autoComplete='off'
        />
        <FormControl.Feedback />
      </FormGroup>
      <button className='btn btn-success' onSubmit={(e) => this.submit(e)} style={{float: 'right'}} disabled={!valid.all}>
        Add
      </button>
      <div className='clearfix' />
    </form>
  }
}

CreateNewChatTopicForm.propTypes = {
  value: React.PropTypes.string
}

export default CreateNewChatTopicForm
