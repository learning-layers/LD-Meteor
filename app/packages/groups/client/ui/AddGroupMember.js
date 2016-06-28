import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import ReactSelectize from 'react-selectize'
const MultiSelect = ReactSelectize.MultiSelect
import Alert from 'react-s-alert'

class AddGroupMember extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userOptions: [
      ]
    }
  }
  addUserFromOption (item) {
    Meteor.call('addUserToGroup', this.props.groupId, item.value, function (err, res) {
      if (err) {
        Alert.error('Error: Adding user \'' + item.label + ' to the group.')
      }
      if (res) {
        Alert.success('Success: Adding user \'' + item.label + ' to the group.')
      }
    })
    this.resetSearch()
  }
  resetSearch () {
    console.log(this.refs.groupMemberTags)
    this.refs.groupMemberTags.setState({search: ''})
  }
  render () {
    // TODO retrieve user suggestions
    let { groupMembers } = this.props
    if (!groupMembers) {
      groupMembers = []
    }
    return <div className='add-group-member'>
      <MultiSelect
        ref='groupMemberTags'
        anchor={undefined}
        width='200px'
        placeholder='Enter tags here...'
        options={this.state.userOptions}
        values={groupMembers}
        onSearchChange={(search) => {
          Meteor.call('getMentions', {mentionSearch: search}, (err, res) => {
            if (err) {
              //
            }
            if (res) {
              // create new tagOptions
              let userOptions = res.map(function (user) {
                return {
                  label: user.profile.name,
                  value: user._id
                }
              })
              this.setState({
                userOptions: userOptions
              })
            }
          })
        }}
        theme='material'
        createFromSearch={(options, values, search) => {
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
        renderValue={(item) => {
          return <div className='removable-emoji'>
            {item.label}
            <div style={{display: 'inline', marginLeft: '5px'}} onClick={() => {
              let result = window.confirm('Do you want to remove the tag \'' + item.label + '?')
              if (result) {
                console.log(item)
                Meteor.call('removeUserFromGroup', this.props.groupId, item.value, function (err, res) {
                  if (err) {
                    Alert.error('Error: Removing tag \'' + item.label + '.')
                  }
                  if (res) {
                    Alert.success('Success: Removed tag \'' + item.label + '.')
                    console.log(res)
                  }
                })
              }
            }}> &times;</div>
          </div>
        }}
        onValuesChange={(values) => {
          values.forEach(function (value) {
            if (!value._id) {
              // insert the value into the database
              Meteor.call('addUserToGroup', value.label, value.value, Meteor.userId(), function (err, res) {
                if (err) {
                  //
                }
                Alert.success('Success: Adding tag \'' + value.label + '.')
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
          // TODO get profile picture
          return <div>
            {item.value !== item.label ? <div className='simple-option' onClick={() => this.addUserFromOption(item)}>
              <span>{item.label}</span>
              <span>- {item.value}</span>
            </div> : null}
          </div>
        }}
      />
    </div>
  }
}

export default AddGroupMember
