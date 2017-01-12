import { Meteor } from 'meteor/meteor'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Alert from 'react-s-alert'
import ButtonToolbar from '../../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../../node_modules/react-bootstrap/lib/Button'

export default class EditableDocumentTitleInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editMode: false,
      inputDisabled: false,
      documentTitle: this.props.documentTitle
    }
  }
  setNewDocumentTitle () {
    this.setState({
      inputDisabled: true
    })
    Meteor.call('changeDocumentTitle', this.props.documentId, this.state.documentTitle, (err, res) => {
      if (err) {
        this.setState({
          inputDisabled: false
        })
        Alert.error('Changing document title failed.')
      }
      if (res) {
        this.setEditMode(false)
        this.setState({
          inputDisabled: true,
          editMode: false
        })
        Alert.success('Successfully change document title.')
      }
    })
  }
  setEditMode (newEditMode) {
    this.setState({
      documentTitle: this.props.documentTitle,
      editMode: newEditMode
    })
  }
  handleChange (event) {
    let changedDocumentTitle = ReactDOM.findDOMNode(event.target).value
    this.setState({
      documentTitle: changedDocumentTitle
    })
  }
  render () {
    const { documentTitle } = this.props
    if (this.state.editMode) {
      return <div className='document-title-area'>
        <input type='text'
          value={this.state.documentTitle}
          style={{color: 'black'}}
          onChange={(event) => this.handleChange(event)}
          disabled={this.state.inputDisabled} />
        <ButtonToolbar className='change-document-title-btns' style={{marginLeft: '7px'}}>
          <Button className='new-document-title-submit-button' bsStyle='success' bsSize='small' onClick={() => this.setNewDocumentTitle()}>
            <span className='glyphicon glyphicon-ok' />
          </Button>
          <Button className='new-document-title-cancel-button' bsSize='small' onClick={() => this.setEditMode(false)}>
            Cancel
          </Button>
        </ButtonToolbar>
      </div>
    } else {
      return <h4 className='document-title' onClick={() => this.setEditMode(true)}>{documentTitle}</h4>
    }
  }
}

EditableDocumentTitleInput.propTypes = {
  documentId: PropTypes.string,
  documentTitle: PropTypes.string
}
