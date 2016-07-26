import React, {Component} from 'react'
import { Images, fileUpload } from '../../lib/collections'
import { Tracker } from 'meteor/tracker'
import Alert from 'react-s-alert'

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

class FileUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentFile: null
    }
  }
  componentWillUnmount () {
    if (this.computation) {
      this.computation.stop()
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
          collection: this.props.collection,
          elementId: this.props.elementId,
          uploadType: this.props.uploadType
        }
      }
      var self = this
      let upload = Images.insert({
        file: file,
        meta: metaData,
        onUploaded: function (error, fileObj) {
          if (error) {
            Alert.error('Error during upload of file \'' + fileObj.name + '\' ' + error)
          } else {
            self.setState({progress: 100, uploadSuccess: true})
            Alert.success('File \'' + fileObj.name + '\' successfully uploaded')
          }
        },
        streams: 'dynamic',
        chunkSize: 'dynamic'
      })
      this.setState({currentFile: upload, uploadSuccess: null, progress: 0})
      this.trackProgress(upload)
    }
  }
  trackProgress (currentFileUpload) {
    console.log('Tracking progress 1')
    if (this.computation) {
      this.computation.stop()
    }
    let computation = Tracker.autorun((comp) => {
      console.log('Tracking progress 2')
      let currentProgress = currentFileUpload.progress.get()
      if (currentProgress !== 0) {
        this.setState({
          progress: currentProgress,
          estSpeed: currentFileUpload.estimateSpeed.get(),
          estTime: currentFileUpload.estimateTime.get()
        })
      }
    })
    this.computation = computation
  }
  render () {
    let currentFileUpload = this.state.currentFile
    if (currentFileUpload && !this.state.progress) {
      this.state.progress = 0
    }
    let interceptor = fileUpload.interceptorMap[this.props.collection + '#' + this.props.uploadType]
    return <div className='fileUpload'>
      {currentFileUpload ? <div className='uploadIndicator'>
        Uploading <b>{currentFileUpload.file.name}</b>:
        <div className='progress'>
          {this.state.uploadSuccess ? <div style={{width: this.state.progress + '%'}} className='progress-bar progress-bar-success'>
            <span className='sr-only'>{this.state.progress}%</span>
          </div> : <div style={{width: this.state.progress + '%'}} className='progress-bar progress-bar-striped active'>
            <span className='sr-only'>{this.state.progress}%</span>
          </div>}
        </div>
      </div> : null}
      <input id='fileInput' type='file' onChange={(ev) => this.handleFileUploadChange(ev)} />
      <p>
        <small>Upload file in <code>{interceptor.allowedExtensions.join(',')}</code> format, with size less or equal to {humanFileSize(interceptor.allowedSize, true)}</small>
      </p>
    </div>
  }
}

FileUpload.propTypes = {
  collection: React.PropTypes.string,
  elementId: React.PropTypes.string,
  uploadType: React.PropTypes.string
}

export default FileUpload
