import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import {compose} from 'react-komposer'
import FileUpload from '../../../fileUpload/client/ui/FileUpload'
import { Uploads } from '../../../fileUpload/lib/collections'
import { Tracker } from 'meteor/tracker'

function getTrackerLoader (reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env)
      })
    })

    return () => {
      if (typeof trackerCleanup === 'function') trackerCleanup()
      return handler.stop()
    }
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

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('helpVideoAttachments')
  if (handle.ready()) {
    let helpVideoAttachments = Uploads.collection.find({'meta.parent.collection': 'helpvideos', 'meta.parent.uploadType': 'helpvideo', 'meta.parent.elementId': 'admin'}).fetch()
    onData(null, { helpVideoAttachments })
  }
}

class HelpVideoUpload extends Component {
  deleteAttachment (fileAttachment) {
    global.window.swal({
      title: 'Remove attachment',
      text: 'Do you want to remove the attachment \'' + fileAttachment.name + '?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, remove it!',
      closeOnConfirm: true
    }, (isConfirm) => {
      if (isConfirm) {
        Meteor.call('deleteHelpVideoAttachment', fileAttachment._id)
      }
    })
  }
  copyDownloadLink (fileAttachment) {
    ReactDOM.findDOMNode(this.refs['downloadLink-' + fileAttachment._id]).select()
    try {
      var successful = document.execCommand('copy')
      var msg = successful ? 'successful' : 'unsuccessful'
      window.alert('Copying download link command was ' + msg)
    } catch (err) {
      window.alert('Oops, unable to copy')
    }
  }
  render () {
    const { helpVideoAttachments } = this.props
    return <div id='help-video-upload' className='container-fluid'>
      <FileUpload collection='helpvideos' elementId='admin' uploadType='helpvideo' />
      <div className='uploaded-helpvideos table-responsive'>
        <table className='table table-bordered table-striped table-hover table-condensed'>
          <thead>
            <tr><th>Name</th><th>Size</th><th>Type</th><th>Downloads</th><th>Options</th></tr>
          </thead>
          <tbody>
            {helpVideoAttachments.map((fileAttachment) => {
              let downloadPath = fileAttachment._downloadRoute + '/' + fileAttachment._collectionName + '/' + fileAttachment._id + '/original/' + fileAttachment._id + '.' + fileAttachment.extension
              return <tr>
                <td>
                  <a href={downloadPath + '?download=true'} download={fileAttachment.name} target='_parent'>
                    {fileAttachment.name}
                  </a>
                  {fileAttachment.isAudio ? <audio preload='auto' controls='controls'>
                    <source src={downloadPath + '?play=true'} type={fileAttachment.type} />
                  </audio> : null}
                  {fileAttachment.isVideo ? <video width='200px' height='auto' controls='controls' preload='auto'>
                    <source src={downloadPath + '?play=true'} type={fileAttachment.type} />
                  </video> : null}
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
                  <input ref={'downloadLink-' + fileAttachment._id} type='text' value={downloadPath} style={{visibility: 'hidden', width: '0px', height: '0px'}} />
                  <button className='btn btn-sm btn-danger' onClick={() => this.deleteAttachment(fileAttachment)}>Delete</button>
                  <button className='btn btn-sm btn-default' onClick={() => this.copyDownloadLink(fileAttachment)}>Copy link</button>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  }
}

export default compose(getTrackerLoader(onPropsChange))(HelpVideoUpload)
