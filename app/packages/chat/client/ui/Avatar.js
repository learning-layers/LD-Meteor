import React, {Component} from 'react'
import Image from '../../../../../node_modules/react-bootstrap/lib/Image'

class Avatar extends Component {
  render () {
    let { onlineStatus, avatarSrc } = this.props
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
    if (avatarSrc === undefined) {
      avatarSrc = 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
    }
    return <div className='avatar'>
      <Image className='sidebar-avatar' src={avatarSrc} circle />
      <div className='avatar-online-status' style={onlineStatusStyle}>{onlineStatus}</div>
    </div>
  }
}

export default Avatar
