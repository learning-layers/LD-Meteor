import React, {Component} from 'react'
import Image from '../../../../../node_modules/react-bootstrap/lib/Image'
import NotificationStatusIndicator from './NotificationStatusIndicator'

class Avatar extends Component {
  render () {
    let { onlineStatus, userAvatarPath } = this.props
    let onlineStatusColor = 'green'
    switch (onlineStatus) {
      case 'On':
        onlineStatusColor = 'green'
        break
      case 'Off':
        onlineStatusColor = 'white'
        break
      case 'Afk':
        onlineStatusColor = 'red'
        break
      case 'DND':
        onlineStatusColor = 'red'
        break
      default:
        onlineStatusColor = 'green'
        onlineStatus = 'On'
        break
    }
    let onlineStatusStyle = {backgroundColor: onlineStatusColor}
    return <div className='avatar'>
      <Image className='sidebar-avatar' src={userAvatarPath} circle />
      <div className='avatar-online-status' style={onlineStatusStyle}>{onlineStatus}</div>
      <NotificationStatusIndicator style={{display: 'none'}} />
    </div>
  }
}

Avatar.propTypes = {
  onlineStatus: React.PropTypes.string,
  userAvatarPath: React.PropTypes.string
}

export default Avatar
