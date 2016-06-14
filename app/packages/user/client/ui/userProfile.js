import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Match } from 'meteor/check'
import Tabs from '../../../../../node_modules/react-bootstrap/lib/Tabs'
import Tab from '../../../../../node_modules/react-bootstrap/lib/Tab'
import ValidatedInput from './validatedInput'
import UserProfileContent from './userProfileContent'
import Loader from 'react-loader'

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

class ValidatedForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      price: ''
    }
  }
  handleChange (e) {
    this.setState({
      value: e.target.value
    })
  }
  handlePriceChange (e) {
    this.setState({
      price: e.target.value
    })
  }
  validate (state) {
    return {
      name: Match.test({name: state.value}, this.props.schema.pick(['name'])),
      price: Match.test({price: state.price}, this.props.schema.pick(['price']))
    }
  }
  render () {
    var valid = this.validate(this.state)
    const {schema} = this.props
    return (
      <div>
        <ValidatedInput valid={valid.name}
          className='foobar'
          value={this.state.value}
          onChange={(e) => this.handleChange(e)}
          placeholder={schema._schema.name.placeholder} />
        <ValidatedInput valid={valid.price}
          value={this.state.price}
          onChange={(e) => this.handlePriceChange(e)}
          placeholder={schema._schema.price.placeholder} />
      </div>
    )
  }
}

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
