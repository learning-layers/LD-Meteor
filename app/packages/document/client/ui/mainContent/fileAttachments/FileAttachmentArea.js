import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Collapse from '../../../../../../../node_modules/react-bootstrap/lib/Collapse'
import Well from '../../../../../../../node_modules/react-bootstrap/lib/Well'
import FileUpload from '../../../../../fileUpload/client/ui/FileUpload'
import { Uploads } from '../../../../../fileUpload/lib/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('documentAttachments', {documentId: props.documentId})
  if (handle.ready()) {
    let fileAttachments = Uploads.collection.find({'meta.parent.collection': 'document', 'meta.parent.uploadType': 'attachment', 'meta.parent.elementId': props.documentId}).fetch()
    onData(null, { fileAttachments })
  }
}

function humanFileSize (bytes, si) {
  var thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  var u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
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
  deleteAttachment (attachmentId) {
    Meteor.call('deleteDocumentAttachment', attachmentId, this.props.documentId)
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
      <div className='uploaded-files table-responsive'>
        <table className='table table-bordered table-striped table-hover table-condensed'>
          <thead>
            <tr><th>Name</th><th>Size</th><th>Type</th><th>Downloads</th><th>Options</th></tr>
          </thead>
          <tbody>
            {fileAttachments.map((fileAttachment) => {
              let downloadPath = fileAttachment._downloadRoute + '/' + fileAttachment._collectionName + '/' + fileAttachment._id + '/original/' + fileAttachment._id + '.' + fileAttachment.extension
              return <tr>
                <td>
                  <a href={downloadPath + '?download=true'} download={fileAttachment.name} target='_parent'>
                    {fileAttachment.name}
                  </a>
                </td>
                <td>
                  {humanFileSize(fileAttachment.size, true)}
                </td>
                <td>
                  {fileAttachment.type}
                </td>
                <td>
                  {fileAttachment.meta && fileAttachment.meta.downloads ? <span>{fileAttachment.meta.downloads}</span> : <span>0</span>}
                </td>
                <td>
                  <button className='btn btn-sm btn-danger' onClick={() => this.deleteAttachment(fileAttachment._id)}>Delete</button>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  }
}

FileAttachmentArea.propTypes = {
  documentId: React.PropTypes.string,
  fileAttachments: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(FileAttachmentArea)
