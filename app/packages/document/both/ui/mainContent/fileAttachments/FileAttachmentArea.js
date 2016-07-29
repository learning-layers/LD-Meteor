import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Collapse from '../../../../../../../node_modules/react-bootstrap/lib/Collapse'
import Well from '../../../../../../../node_modules/react-bootstrap/lib/Well'
import FileUpload from '../../../../../fileUpload/both/ui/FileUpload'
import { Uploads } from '../../../../../fileUpload/lib/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('documentAttachments', {documentId: props.documentId})
  if (handle.ready()) {
    let fileAttachments = Uploads.collection.find({'meta.parent.collection': 'document', 'meta.parent.uploadType': 'attachment', 'meta.parent.elementId': props.documentId}).fetch()
    onData(null, {fileAttachments})
  }
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
    const { documentId, fileAttachments } = this.props
    return <div className='file-attachments'>
      <div className='uploading-panel'>
        <Well style={{padding: 0, marginBottom: 0}}>
          <Collapse in={this.state.open}>
            <Well style={{backgroundColor: 'white', marginBottom: 0}}>
              <FileUpload collection='document' elementId={documentId} uploadType='attachment' />
            </Well>
          </Collapse>
          <div className='open-close-handle'>
            <button id='open-close-file-upload' className='btn btn-info' onClick={() => this.toggle()} style={{margin: '7px'}}>
              {this.state.open ? 'Close Upload Area' : 'Upload new file'}
            </button>
          </div>
        </Well>
      </div>
      <div className='uploaded-files'>
        <ul>
          {fileAttachments.map((fileAttachment) => {
            console.log(JSON.stringify(fileAttachment))
            let downloadPath = fileAttachment._downloadRoute + '/' + fileAttachment._collectionName + '/' + fileAttachment._id + '/original/' + fileAttachment._id + '.' + fileAttachment.extension
            return <li className='presentation'>
              <a href={downloadPath + '?download=true'} download={fileAttachment.name} target='_parent'>
                {fileAttachment.name}
              </a>
            </li>
          })}
        </ul>
      </div>
    </div>
  }
}

FileAttachmentArea.propTypes = {
  documentId: React.PropTypes.string,
  fileAttachments: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(FileAttachmentArea)
