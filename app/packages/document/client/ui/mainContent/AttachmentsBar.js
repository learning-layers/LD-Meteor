import React, {Component} from 'react'
import classNames from 'classnames'

class AttachmentsBar extends Component {
  render () {
    let editorTabClassNames = classNames({'active': this.props.activeTabName === 'Editor', 'editor-tab-btn': true})
    let filesTabClassNames = classNames({'active': this.props.activeTabName === 'Files', 'files-tab-btn': true})
    // let mediaTabClassNames = classNames({'active': this.props.activeTabName === 'Media'})
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
  onChangeTabSelection: React.PropTypes.func
}

export default AttachmentsBar
