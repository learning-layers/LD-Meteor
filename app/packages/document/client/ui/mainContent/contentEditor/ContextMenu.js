import React, {Component} from 'react'
import onClickOutside from 'react-onclickoutside'
import { Documents } from '../../../../lib/collections'
import { printDocument, exportToWord } from '../../../lib/utils'
import EventEmitterInstance from '../../../../../../common/client/EventEmitter'

class ContextMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      posX: 0,
      posY: 0,
      selection: props.selection,
      closeOnMouseOut: false,
      documentId: props.documentId
    }
  }
  handleClickOutside (evt) {
    EventEmitterInstance.emit('close-content-editor-context-menu')
  }
  handleMouseLeave () {
    EventEmitterInstance.emit('close-content-editor-context-menu')
  }
  discussParagraph (selection, documentId) {
    EventEmitterInstance.emit('close-content-editor-context-menu')
    EventEmitterInstance.emit('open-create-sub-document-modal', selection, documentId)
  }
  printDocument () {
    printDocument()
  }
  exportToWord () {
    let document = Documents.findOne({_id: this.state.documentId})
    exportToWord(document.title)
  }
  exportToPDF () {
    //
  }
  render () {
    let style = {
      left: this.props.clientX,
      top: this.props.clientY - 145
    }
    let showSelectionPossibility = this.props.selection && this.props.selection.htmlContent && this.props.selection.htmlContent !== ''
    return (
      <div className='cctx' style={style} onMouseLeave={() => this.handleMouseLeave()}>
        <ul>
          {showSelectionPossibility ? <li className='cctx-item' onClick={() => this.discussParagraph(this.props.selection, this.state.documentId)}>
            <div className='cctx-item-icon'>
              <div className='discuss-section'>
                <div style={{display: 'none'}} className='glyph-minus'><span className='glyphicon glyphicon-minus' /></div>
                <div className='glyph-pencil'><span className='glyphicon glyphicon-pencil' /></div>
              </div>
            </div>
            Start a conversation for this paragraph
          </li> : null}
          {showSelectionPossibility ? <li className='cctx-separator' /> : null}
          <li className='cctx-item' onClick={() => this.printDocument()}>
            <div className='cctx-item-icon' />
            Print this document
          </li>
          <li className='cctx-separator' />
          <li className='cctx-item' onClick={() => this.exportToWord()}>
            <div className='cctx-item-icon' />
            Export this document to a word file
          </li>
          <li style={{display: 'none'}} className='cctx-item' onClick={() => this.exportToPDF()}>
            <div className='cctx-item-icon' />
            Export this document to a pdf file
          </li>
        </ul>
      </div>
    )
  }
}

ContextMenu.propTypes = {
  selection: React.PropTypes.object,
  clientX: React.PropTypes.number,
  clientY: React.PropTypes.number
}

// eventTypes={["click", "mouseleave"]}
export default onClickOutside(ContextMenu)
