import React, {Component} from 'react'
import ReactSelectize from 'react-selectize'
import { Tags } from '../../../tags/lib/collections'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Alert from 'react-s-alert'
const MultiSelect = ReactSelectize.MultiSelect

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('userTags', {userId: props.userId})
  if (handle.ready() && props.userId) {
    const userTags = Tags.find({ parentId: props.userId, type: 'user' }).fetch()
    onData(null, { userTags })
  }
}

class UserTags extends Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      tagOptions: [
      ]
    }
  }
  addTagFromOption (item) {
    Meteor.call('addTagToUser', item.label, item.value, this.props.userId, function (err, res) {
      if (err) {
        Alert.error('Error: Adding tag \'' + item.label + '.')
      }
      if (res) {
        Alert.success('Success: Adding tag \'' + item.label + '.')
      }
    })
    this.resetSearch()
  }
  resetSearch () {
    console.log(this.refs.userTags)
    this.refs.userTags.setState({search: ''})
  }
  render () {
    const { userTags } = this.props
    return <div className='user-tags'>
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
          // console.log('searching')
          // console.log(options)
          // console.log(values)
          // console.log(search)
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
              global.window.swal({
                title: 'Remove tag',
                text: 'Do you want to remove the tag \'' + item.label + '?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes, remove it!',
                closeOnConfirm: true
              }, (isConfirm) => {
                if (isConfirm) {
                  Meteor.call('removeTagFromUser', item._id, function (err, res) {
                    if (err) {
                      Alert.error('Error: Removing tag \'' + item.label + '.')
                    }
                    if (res) {
                      Alert.success('Success: Removed tag \'' + item.label + '.')
                      console.log(res)
                    }
                  })
                }
              })
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
                  Alert.error('Error: Removing tag \'' + currentTag.label + '.')
                }
                if (res) {
                  Alert.success('Success: Removed tag \'' + currentTag.label + '.')
                }
              })
            }
          })
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
  }
}

UserTags.propTypes = {
  userId: React.PropTypes.string,
  userTags: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(UserTags)
