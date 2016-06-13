import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import FileUpload from '../../../fileUpload/client/ui/FileUpload'
import Row from '../../../../../node_modules/react-bootstrap/lib/Row'
import Col from '../../../../../node_modules/react-bootstrap/lib/Col'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import ControlLabel from '../../../../../node_modules/react-bootstrap/lib/ControlLabel'
import FormControl from '../../../../../node_modules/react-bootstrap/lib/FormControl'
import { Uploads } from '../../../fileUpload/lib/collections'
import ReactSelectize from 'react-selectize'
import { composeWithTracker } from 'react-komposer'
const MultiSelect = ReactSelectize.MultiSelect

function onPropsChange (props, onData) {
  const userAvatar = Uploads.collection.findOne({'meta.parent.uploadType': 'avatar', 'meta.parent.elementId': Meteor.userId()})
  let userAvatarPath
  if (userAvatar) {
    userAvatarPath = userAvatar._downloadRoute + '/' + userAvatar._collectionName + '/' + userAvatar._id + '/original/' + userAvatar._id + '.' + userAvatar.extension
  }
  if (!userAvatarPath) {
    userAvatarPath = '/img/Portrait_placeholder.png'
  }
  onData(null, {userAvatarPath})
}

class UserProfileContent extends Component {
  render () {
    const { user, userAvatarPath } = this.props
    const userId = user._id
    return <Row id='user-profile'>
      <Col xs={12} md={3}>
        <a href='' id='user-profile-avatar' className='thumbnail'>
          <img className='img-responsive' src={userAvatarPath} />
        </a>
        <div className='well'>
          <FileUpload collection='user' elementId={userId} uploadType='avatar' />
        </div>
        <div className='user-tags'>
          <MultiSelect
            width='200px'
            placeholder='Enter tags here...'
            // createFromSearch :: [Item] -> [Item] -> String -> Item?
            createFromSearch={function (options, values, search) {
              values = [{label: 'testLabel'}]
              const labels = values.map(function (value) {
                return value.label
              })
              if (search.trim().length === 0 || labels.indexOf(search.trim()) !== -1) {
                return null
              }
              return {label: search.trim(), value: search.trim()}
            }}
            renderValue={function (item) {
              return <div className='removable-emoji'>
                {item.label}
                <div style={{display: 'inline', marginLeft: '5px'}} onClick={function () {
                  window.alert('test')
                }}> &times;</div>
              </div>
            }}
          />
        </div>
      </Col>
      <Col xs={12} md={9}>
        <div className='user-profile-info'>
          <h2 id='personal-info-header'>Personal Info</h2>
          <form>
            <FormGroup controlId='userFullNameText'>
              <ControlLabel>Full Name</ControlLabel>
              <FormControl type='text' placeholder='Enter Full Name...' />
            </FormGroup>
            <FormGroup controlId='userDescriptionTextArea'>
              <ControlLabel>Description</ControlLabel>
              <FormControl type='textarea' placeholder='Enter Description...' />
            </FormGroup>
          </form>
        </div>
      </Col>
    </Row>
  }
}

export default composeWithTracker(onPropsChange)(UserProfileContent)
