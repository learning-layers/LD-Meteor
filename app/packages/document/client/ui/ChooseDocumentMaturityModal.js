import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import Modal from '../../../../../node_modules/react-bootstrap/lib/Modal'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import { Documents } from '../../lib/collections'
import Label from '../../../../../node_modules/react-bootstrap/lib/Label'

let labelColors = []
labelColors['default'] = 'default'
labelColors['draft'] = 'warning'
labelColors['agreed upon'] = 'success'
labelColors['stable'] = 'primary'

class ChooseDocumentMaturityModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: true,
      documentId: props.documentId
    }
  }
  close () {
    this.setState({
      showModal: false
    })
  }
  open (documentId) {
    this.setState({
      showModal: true,
      documentId: documentId
    })
  }
  setMaturityLevel (maturityLevel) {
    Meteor.call('changeDocumentMaturity', this.state.documentId, maturityLevel)
  }
  render () {
    const { documentId } = this.state
    const document = Documents.findOne({_id: documentId})
    let currentMaturityLevel = 'default'
    if (document && document.maturityLevel) {
      currentMaturityLevel = document.maturityLevel
    }
    let notChosenClasses = ''
    let draftClasses = ''
    let agreedClasses = ''
    let stableClasses = ''
    switch (currentMaturityLevel) {
      case 'default':
        notChosenClasses = 'active'
        break
      case 'draft':
        draftClasses = 'active'
        break
      case 'agreed':
        agreedClasses = 'active'
        break
      case 'stable':
        stableClasses = 'active'
        break
    }
    return <Modal id='choose-doc-maturity-modal' show={this.state.showModal} onHide={() => this.close()}>
      <Modal.Header closeButton>
        <Modal.Title>Choose document maturity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {document ? <div className='chooser'>
          <ul className='maturity-lvl-list'>
            <li className={notChosenClasses} onClick={() => this.setMaturityLevel('default')}>
              <h4><Label bsStyle={labelColors['default']}>Not chosen</Label></h4>
            </li>
            <li className={draftClasses} onClick={() => this.setMaturityLevel('draft')}>
              <h4><Label bsStyle={labelColors['draft']}>Draft</Label></h4>
            </li>
            <li className={agreedClasses} onClick={() => this.setMaturityLevel('agreed upon')}>
              <h4><Label bsStyle={labelColors['agreed upon']}>Agreed upon</Label></h4>
            </li>
            <li className={stableClasses} onClick={() => this.setMaturityLevel('stable')}>
              <h4><Label bsStyle={labelColors['stable']}>Stable</Label></h4>
            </li>
          </ul>
        </div> : null}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.close()}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}

ChooseDocumentMaturityModal.propTypes = {
  documentId: React.PropTypes.string
}

export default ChooseDocumentMaturityModal
