import React, {Component} from 'react'
import Loader from 'react-loader'
import { composeWithTracker } from 'react-komposer'
import Collapse from '../../../../../../../node_modules/react-bootstrap/lib/Collapse'
import Well from '../../../../../../../node_modules/react-bootstrap/lib/Well'

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
    return <div className='file-attachments'>
      <div className='uploading-panel'>
        <Collapse in={this.state.open}>
          <Well>
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
          </Well>
        </Collapse>
        <div className='open-close-handle'>
          <button id='open-close-file-upload' className='btn btn-default' onClick={() => this.toggle()}>
            {this.state.open ? 'Close Upload Area' : 'Upload new file'}
          </button>
        </div>
      </div>
      <div className='uploaded-files'>
      </div>
    </div>
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(FileAttachmentArea)
