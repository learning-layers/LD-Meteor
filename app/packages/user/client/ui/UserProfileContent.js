import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import FileUpload from '../../../fileUpload/client/ui/FileUpload'
import Row from '../../../../../node_modules/react-bootstrap/lib/Row'
import Col from '../../../../../node_modules/react-bootstrap/lib/Col'
import { Uploads } from '../../../fileUpload/lib/collections'
import { compose } from 'react-komposer'
import UserTags from './UserTags'
import UserProfileInfoForm from './UserProfileInfoForm'
import { UserProfileSchema } from '../../lib/schema'
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
          <UserProfileInfoForm user={user} schema={UserProfileSchema} />
        </div>
      </Col>
    </Row>
  }
}

UserProfileContent.propTypes = {
  user: React.PropTypes.object,
  userAvatarPath: React.PropTypes.string
}

export default compose(getTrackerLoader(onPropsChange))(UserProfileContent)
