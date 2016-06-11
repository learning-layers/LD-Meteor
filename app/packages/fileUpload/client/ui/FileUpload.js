import React, {Component} from 'react'
import { Uploads } from '../../lib/collections'

class FileUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentFile: null
    }
  }
  handleFileUploadChange (ev) {
    if (ev.target.files && ev.target.files[0]) {
      // We upload only one file, in case
      // there were multiple files selected
      // TODO enable multiple file uploads
      var file = ev.target.files[0]

      let metaData = {
        parent: {
          collection: 'test'
        }
      }
      let upload = Uploads.insert({
        file: file,
        meta: metaData,
        onUploaded: (error, fileObj) => {
          if (error) {
            window.alert('Error during upload: ' + error)
          } else {
            window.alert('File "' + fileObj.name + '" successfully uploaded')
          }
          this.setState({currentFile: null})
        },
        streams: 'dynamic',
        chunkSize: 'dynamic'
      })
      this.setState({currentFile: upload})
    }
  }
  render () {
    return <div className='fileUpload'>
      <input id='fileInput' type='file' onChange={(ev) => this.handleFileUploadChange(ev)} />
      <p>
        <small>Upload file in <code>mp4</code> format, with size less or equal to 10MB</small>
      </p>
    </div>
  }
}

export default FileUpload
