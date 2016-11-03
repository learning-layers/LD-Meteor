import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import Tabs from '../../../../../node_modules/react-bootstrap/lib/Tabs'
import Tab from '../../../../../node_modules/react-bootstrap/lib/Tab'
import UserProfileContent from './UserProfileContent'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('userprofile', {userId: props.userId})
  if (handle.ready()) {
    const user = Meteor.users.findOne({'_id': props.userId})
    onData(null, { user })
  }
}

class UserProfile extends Component {
  render () {
    const { user } = this.props
    return (
      <div className='ld-user-profile container-fluid'>
        {!user ? <Tabs defaultActiveKey={1} id='user-profile-tabs'>
          <Tab eventKey={1} title='User Details'>
            <UserProfileContent />
          </Tab>
          <Tab eventKey={2} title='User Settings'>
            Settings
          </Tab>
        </Tabs> : <UserProfileContent user={user} />}
      </div>
    )
  }
}

UserProfile.propTypes = {
  user: React.PropTypes.object
}

export default composeWithTracker(onPropsChange)(UserProfile)

// TODO move this code to common package or fileUpload
/* var formatFileURL = function (fileRef, version, pub) {
 var ext, ref, root
 if (version == null) {
 version = 'original'
 }
 if (pub == null) {
 pub = false
 }
 root = __meteor_runtime_config__.ROOT_URL.replace(/\/+$/, '')
 if ((fileRef != null ? (ref = fileRef.extension) != null ? ref.length : void 0 : void 0) > 0) {
 ext = '.' + fileRef.extension
 } else {
 ext = ''
 }
 if (pub) {
 return root + (fileRef._downloadRoute + '/' + version + '-' + fileRef._id + ext)
 } else {
 return root + (fileRef._downloadRoute + '/' + fileRef._collectionName + '/' + fileRef._id + '/' + version + '/' + fileRef._id + ext)
 }
 } */
