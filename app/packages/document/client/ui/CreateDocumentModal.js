import React, {Component} from 'react'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import ControlLabel from '../../../../../node_modules/react-bootstrap/lib/ControlLabel'
import Modal from '../../../../../node_modules/react-bootstrap/lib/Modal'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import ValidatedFormControl from '../../../../common/client/ui/forms/ValidatedFormControl'
import { DocumentSchema } from '../../lib/schema'
import { Match } from 'meteor/check'
import { Meteor } from 'meteor/meteor'
import Alert from 'react-s-alert'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'

class CreateDocumentModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: true,
      title: ''
    }
  }
  close () {
    this.setState({
      showModal: false
    })
  }
  open () {
    this.setState({
      showModal: true
    })
  }
  handleChangeTitle (e) {
    this.setState({
      title: e.target.value
    })
  }
  validate (state) {
    let cleanState = JSON.parse(JSON.stringify(this.state))
    delete cleanState.showModal
    cleanState.createdAt = new Date()
    cleanState.createdBy = Meteor.userId()
    return {
      title: Match.test({title: state.title}, DocumentSchema.pick(['title'])),
      all: Match.test(cleanState, DocumentSchema)
    }
  }
  handleSubmit (e) {
    e.preventDefault()
    Meteor.call('createDocument', {title: this.state.title}, (err, res) => {
      if (err) {
        Alert.error('Error: Creating document \'' + this.state.title + '\'')
      }
      if (res) {
        Alert.success('Success: Created document \'' + this.state.title + '\'')
        this.close()
        FlowRouter.go('/document/' + res)
      }
    })
  }
  render () {
    var valid = this.validate(this.state)
    return <Modal className='create-document-modal' show={this.state.showModal} onHide={() => this.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Create a new document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <FormGroup controlId='userDescriptionTextArea'>
            <ControlLabel>{DocumentSchema._schema.title.label}</ControlLabel>
            <ValidatedFormControl
              ref='title'
              type='text'
              valid={valid.title}
              value={this.state.title}
              onChange={(e) => this.handleChangeTitle(e)}
              placeholder={DocumentSchema._schema.title.placeholder}
              autoComplete='off' />
          </FormGroup>
          <button className='btn btn-success' disabled={!valid.all}>Submit</button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.close()}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}

export default CreateDocumentModal
