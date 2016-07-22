import React, {Component} from 'react'
import Loader from 'react-loader'
import { composeWithTracker } from 'react-komposer'
import Collapse from '../../../../../../../node_modules/react-bootstrap/lib/Collapse'
import Well from '../../../../../../../node_modules/react-bootstrap/lib/Well'
import FileUpload from '../../../../../fileUpload/client/ui/FileUpload'

function onPropsChange (props, onData) {
  onData(null, {})
}

class FileAttachmentArea extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }
  toggle () {
    this.setState({
      open: !this.state.open
    })
  }
  render () {
    const { documentId } = this.props
    return <div className='file-attachments'>
      <div className='uploading-panel'>
        <Well style={{padding: 0, marginBottom: 0}}>
          <Collapse in={this.state.open}>
            <Well style={{backgroundColor: 'white', marginBottom: 0}}>
              <FileUpload collection='document' elementId={documentId} uploadType='attachment' />
            </Well>
          </Collapse>
          <div className='open-close-handle'>
            <button id='open-close-file-upload' className='btn btn-default' onClick={() => this.toggle()} style={{margin: '7px'}}>
              {this.state.open ? 'Close Upload Area' : 'Upload new file'}
            </button>
          </div>
        </Well>
      </div>
      <div className='uploaded-files'>
      </div>
    </div>
  }
}

FileAttachmentArea.propTypes = {
  documentId: React.PropTypes.string
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(FileAttachmentArea)
