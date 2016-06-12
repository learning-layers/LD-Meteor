import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import debounce from 'lodash/debounce'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Match } from 'meteor/check'
import ReactSelectize from 'react-selectize'
import FileUpload from '../../../fileUpload/client/ui/FileUpload'
import Row from '../../../../../node_modules/react-bootstrap/lib/Row'
import Col from '../../../../../node_modules/react-bootstrap/lib/Col'
import Tabs from '../../../../../node_modules/react-bootstrap/lib/Tabs'
import Tab from '../../../../../node_modules/react-bootstrap/lib/Tab'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import ControlLabel from '../../../../../node_modules/react-bootstrap/lib/ControlLabel'
import FormControl from '../../../../../node_modules/react-bootstrap/lib/FormControl'
import { Uploads } from '../../../fileUpload/lib/collections'

const SimpleSelect = ReactSelectize.SimpleSelect
const MultiSelect = ReactSelectize.MultiSelect

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

class ValidatedInput extends Component {
  constructor (props) {
    super(props)
    this.state = {validationStarted: false}
    this.componentWillMount.bind(this)
    this.handleChange.bind(this)
  }
  prepareToValidate () {}
  componentWillMount () {
    var startValidation = () => {
      this.setState({
        validationStarted: true
      })
    }
    // if non-blank value: validate now
    if (this.props.value) {
      startValidation()
    } else {
      // wait until the user starts typing, and then stops
      this.prepareToValidate = debounce(startValidation, 1000)
    }
  }
  handleChange (e) {
    if (!this.state.validationStarted) {
      this.prepareToValidate()
    }
    this.props.onChange && this.props.onChange(e)
  }
  render () {
    var className = ''
    if (this.state.validationStarted) {
      className = (this.props.valid ? 'valid' : 'invalid')
    }
    return (
      <input
        {...this.props}
        className={className}
        onChange={(e) => this.handleChange(e)} />
    )
  }
}

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
  const user = Meteor.user()
  onData(null, {user})
}

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

class UserProfileContent extends Component {
  render () {
    const { user } = this.props
    let userId = user._id
    let userAvatar = Uploads.collection.findOne({'meta.parent.uploadType': 'avatar', 'meta.parent.elementId': Meteor.userId()})
    let userAvatarPath
    if (userAvatar) {
      userAvatarPath = userAvatar._downloadRoute + '/' + userAvatar._collectionName + '/' + userAvatar._id + '/original/' + userAvatar._id + '.' + userAvatar.extension
    }
    if (!userAvatarPath) {
      userAvatarPath = '/img/Portrait_placeholder.png'
    }
    console.log(userAvatar)
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
        <SimpleSelect
          placeholder='Select a fruit'
          onValueChange={function (value) {
            window.alert(value)
          }}>
          <option value='apple'>apple</option>
          <option value='mango'>mango</option>
          <option value='orange'>orange</option>
          <option value='banana'>banana</option>
        </SimpleSelect>
        <MultiSelect
          placeholder='Select fruits'
          options={['apple', 'mango', 'orange', 'banana'].map(function (fruit) {
            return {label: fruit, value: fruit}
          })}
          onValuesChange={function (values) {
            window.alert(values)
          }}
        />
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(UserProfile)
