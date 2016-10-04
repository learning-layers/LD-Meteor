import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Label from '../../../../../node_modules/react-bootstrap/lib/Label'
import ChooseDocumentMaturityModal from './ChooseDocumentMaturityModal'

let labelColors = []
labelColors['default'] = 'default'
labelColors['draft'] = 'warning'
labelColors['agreed upon'] = 'success'
labelColors['stable'] = 'primary'

class DocumentStatusIndicator extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hovered: false
    }
  }
  onMouseEnter () {
    this.setState({hovered: true})
  }
  onMouseLeave () {
    this.setState({hovered: false})
  }
  openChooseDocumentMaturityModal () {
    let renderToElement = this.refs.chooseDocumentMaturityModal
    if (!this.state.chooseDocumentMaturityModal) {
      this.state.chooseDocumentMaturityModal = ReactDOM.render(
        <ChooseDocumentMaturityModal documentId={this.props.documentId} />, renderToElement
      )
    } else {
      this.state.chooseDocumentMaturityModal.open(this.props.documentId)
    }
  }
  render () {
    const { documentStatus } = this.props
    let documentStatusText = documentStatus
    let labelColor = 'default'
    if (documentStatus) {
      labelColor = labelColors[documentStatus]
    }
    if (this.state.hovered) {
      labelColor = 'info'
      documentStatusText = 'Click to choose'
    } else {
      switch (documentStatus) {
        case 'default':
          documentStatusText = 'Indicate maturity'
          break
      }
    }
    return <div id='doc-status-indicator'
      onMouseEnter={() => this.onMouseEnter()}
      onMouseLeave={() => this.onMouseLeave()}
      onClick={() => this.openChooseDocumentMaturityModal()}>
      <h4><Label bsStyle={labelColor}>{documentStatusText}</Label></h4>
      <div ref='chooseDocumentMaturityModal'></div>
    </div>
  }
}

DocumentStatusIndicator.propTypes = {
  documentStatus: React.PropTypes.string,
  documentId: React.PropTypes.string
}

export default DocumentStatusIndicator
