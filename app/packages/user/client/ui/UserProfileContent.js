import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import FileUpload from '../../../fileUpload/client/ui/FileUpload'
import Row from '../../../../../node_modules/react-bootstrap/lib/Row'
import Col from '../../../../../node_modules/react-bootstrap/lib/Col'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import ControlLabel from '../../../../../node_modules/react-bootstrap/lib/ControlLabel'
import FormControl from '../../../../../node_modules/react-bootstrap/lib/FormControl'
import { Uploads } from '../../../fileUpload/lib/collections'
import { composeWithTracker } from 'react-komposer'
import UserTags from './UserTags'

function onPropsChange (props, onData) {
  let user = props.user
  let userId = user._id
  const userAvatar = Uploads.collection.findOne({
    'meta.parent.uploadType': 'avatar',
    'meta.parent.elementId': userId
  })
  let userAvatarPath
  if (userAvatar) {
    userAvatarPath = userAvatar._downloadRoute + '/' + userAvatar._collectionName + '/' + userAvatar._id + '/original/' + userAvatar._id + '.' + userAvatar.extension
  }
  if (!userAvatarPath) {
    userAvatarPath = '/img/Portrait_placeholder.png'
  }
  onData(null, { userAvatarPath })
}

class UserProfileContent extends Component {
  render () {
    const { user, userAvatarPath } = this.props
    const isOwnProfile = user._id === Meteor.userId()
    const userId = user._id
    const userName = user.profile.name
    return <Row id='user-profile'>
      {isOwnProfile ? <Col lg={12}>
        <div className='alert alert-info'>This is your own profile page so you can edit things here.</div>
      </Col> : null}
      <Col xs={12} md={3}>
        <a href='' id='user-profile-avatar' className='thumbnail'>
          <img className='img-responsive' src={userAvatarPath} />
        </a>
        {isOwnProfile ? <div className='well'>
          <FileUpload collection='user' elementId={userId} uploadType='avatar' />
        </div> : null}
        <UserTags userId={userId} />
      </Col>
      <Col xs={12} md={9}>
        <div className='user-profile-info'>
          <h2 id='personal-info-header'>Personal Info of {userName}</h2>
          <form>
            {user._id === Meteor.userId() ? <FormGroup controlId='userDescriptionTextArea'>
              <ControlLabel>Change Displayname</ControlLabel>
              <FormControl type='textarea' placeholder='Enter Displayname...' />
            </FormGroup> : null}
            <FormGroup controlId='userFullNameText'>
              <ControlLabel>Full Name</ControlLabel>
              <FormControl type='text' placeholder='Enter Full Name...' />
            </FormGroup>
            <FormGroup controlId='userDescriptionTextArea'>
              <ControlLabel>Description</ControlLabel>
              <FormControl type='textarea' placeholder='Enter Description...' />
            </FormGroup>
            <button className='btn btn-info'>Submit</button>
          </form>
        </div>
      </Col>
    </Row>
  }
}

export default composeWithTracker(onPropsChange)(UserProfileContent)
