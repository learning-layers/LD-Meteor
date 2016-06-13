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
import { Tags } from '../../../tags/lib/collections'
import Alert from 'react-s-alert'
const MultiSelect = ReactSelectize.MultiSelect

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('userTags')
  if (handle.ready()) {
    const userAvatar = Uploads.collection.findOne({
      'meta.parent.uploadType': 'avatar',
      'meta.parent.elementId': Meteor.userId()
    })
    let userAvatarPath
    if (userAvatar) {
      userAvatarPath = userAvatar._downloadRoute + '/' + userAvatar._collectionName + '/' + userAvatar._id + '/original/' + userAvatar._id + '.' + userAvatar.extension
    }
    if (!userAvatarPath) {
      userAvatarPath = '/img/Portrait_placeholder.png'
    }
    const userTags = Tags.find({ parentId: Meteor.userId(), type: 'user' }).fetch()
    onData(null, { userAvatarPath, userTags })
  }
}

class UserProfileContent extends Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      tagOptions: [
        {label: 'test', name: 'test'}
      ]
    }
  }
  resetSearch () {
    console.log(this.refs.userTags)
    this.refs.userTags.setState({search: ''})
  }
  addTagFromOption (item) {
    Meteor.call('addTagToUser', item.label, item.value, Meteor.userId(), function (err, res) {
      if (err) {
        //
      }
      Alert.success('Success: Adding tag \'' + item.label + '.')
    })
  }
  render () {
    const { user, userAvatarPath, userTags } = this.props
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
            ref='userTags'
            anchor={undefined}
            width='200px'
            placeholder='Enter tags here...'
            options={this.state.tagOptions}
            values={userTags}
            onSearchChange={() => console.log(arguments)}
            theme='material'
            createFromSearch={function (options, values, search) {
              console.log(search)
              // console.debug('searching')
              // console.debug(options)
              // console.debug(values)
              // console.debug(search)
              let labels = values.map(function (value) {
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
                  let result = window.confirm('Do you want to remove the tag \'' + item.label + '?')
                  if (result) {
                    Meteor.call('removeTagFromUser', item._id, function (err, res) {
                      if (err) {
                        //
                      }
                      Alert.success('Success: Removed tag \'' + item.label + '.')
                      console.log(res)
                    })
                  }
                }}> &times;</div>
              </div>
            }}
            onValuesChange={(values) => {
              values.forEach(function (value) {
                if (!value._id) {
                  // insert the value into the database
                  Meteor.call('addTagToUser', value.label, value.value, Meteor.userId(), function (err, res) {
                    if (err) {
                      //
                    }
                    Alert.success('Success: Adding tag \'' + value.label + '.')
                    console.log(res)
                    value._id = res
                  })
                }
              })
              userTags.forEach(function (currentTag) {
                if (values.indexOf(currentTag) === -1) {
                  // remove the value from the database
                  Meteor.call('removeTagFromUser', currentTag._id, function (err, res) {
                    if (err) {
                      //
                    }
                    Alert.success('Success: Removed tag \'' + currentTag.label + '.')
                    console.log(res)
                  })
                }
              })
              this.setState({search: ''})
              this.resetSearch()
            }}
            uid={function (item) {
              return item.value
            }}
            valuesFromPaste={function (options, values, pastedText) {
              return pastedText
                .split(',')
                .filter(function (text) {
                  var labels = values.map(function (item) {
                    return item.label
                  })
                  return labels.indexOf(text) === -1
                })
                .map(function (text) {
                  return {label: text, value: text}
                })
            }}
            renderNoResultsFound={function (values, search) {
              return <div className='no-results-found'>
                {(function () {
                  if (search.trim().length === 0) {
                    return 'Type a few characters to create a tag'
                  } else if (values.map(function (item) { return item.label }).indexOf(search.trim()) !== -1) {
                    return 'Tag already exists'
                  }
                }())}
              </div>
            }}
            renderOption={(item) => {
              return <div className='simple-option' onClick={() => this.addTagFromOption(item)}>
                <span>{item.label}</span>
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
