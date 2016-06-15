import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import Tabs from '../../../../../node_modules/react-bootstrap/lib/Tabs'
import Tab from '../../../../../node_modules/react-bootstrap/lib/Tab'
import UserProfileContent from './UserProfileContent'
import Loader from 'react-loader'
import ValidatedForm from './ValidatedForm'

export const UserProfileSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'name',
    max: 600,
    min: 4,
    placeholder: 'name'
  },
  price: {
    type: String,
    label: 'price',
    regEx: /^\$\d+\.\d+$/,
    placeholder: '$0.00',
    min: 2
  }
})

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

        <br /><br /><br /><br />

        <ValidatedForm schema={UserProfileSchema} />
      </div>
    )
  }
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(UserProfile)

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
 }*/