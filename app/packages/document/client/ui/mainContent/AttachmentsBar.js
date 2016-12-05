import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import classNames from 'classnames'
import { compose } from 'react-komposer'
import { DocumentInfoCaches } from '../../../lib/attachments/collections'
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

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('documentInfoCache', {documentId: props.documentId})
  if (handle.ready()) {
    let documentInfoCache = DocumentInfoCaches.findOne({documentId: props.documentId})
    onData(null, { documentInfoCache })
  }
}

class AttachmentsBar extends Component {
  render () {
    const { documentInfoCache } = this.props
    let fileAttachmentCounter = 0
    if (documentInfoCache && documentInfoCache.fileAttachmentCounter) {
      fileAttachmentCounter = documentInfoCache.fileAttachmentCounter
    }
    let editorTabClassNames = classNames({'active': this.props.activeTabName === 'Editor', 'editor-tab-btn': true})
    let filesTabClassNames = classNames({'active': this.props.activeTabName === 'Files', 'files-tab-btn': true})
    // let historyTabClassNames = classNames({'active': this.props.activeTabName === 'History', 'history-tab-btn': true})
    // let mediaTabClassNames = classNames({'active': this.props.activeTabName === 'Media'})

    /*
    <li className={historyTabClassNames} onClick={() => this.props.onChangeTabSelection('History')}>
      <div className='icon-wrapper'>
        <span className='glyphicon glyphicon-time' />
      </div>
      <div style={{display: 'flex', margin: 'auto'}}>
        <div style={{display: 'flex', margin: 'auto'}}>
          {' '}
        </div>
      </div>
    </li> */
    return <div className='attachments-bar'>
      <ul className='attachment-icons'>
        <li className={editorTabClassNames} onClick={() => this.props.onChangeTabSelection('Editor')}>
          <div className='icon-wrapper'>
            <span className='glyphicon glyphicon-pencil' />
          </div>
        </li>
        <li className={filesTabClassNames} onClick={() => this.props.onChangeTabSelection('Files')}>
          <div className='icon-wrapper'>
            <span className='glyphicon glyphicon-file' />
          </div>
          <div style={{display: 'flex', margin: 'auto'}}>
            <div style={{display: 'flex', margin: 'auto'}}>
              {documentInfoCache ? <span className='badge'>{fileAttachmentCounter}</span> : null}
            </div>
          </div>
        </li>
      </ul>
    </div>
  }
}

/* <li className={mediaTabClassNames} onClick={() => this.props.onChangeTabSelection('Media')}>
 <div className='icon-wrapper'>
 <span className='glyphicon glyphicon-picture' />
 </div>
 </li> */

AttachmentsBar.propTypes = {
  activeTabName: React.PropTypes.string,
  onChangeTabSelection: React.PropTypes.func,
  documentInfoCache: React.PropTypes.object
}

export default compose(getTrackerLoader(onPropsChange))(AttachmentsBar)
