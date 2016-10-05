import React, {Component} from 'react'
import ReactSelectize from 'react-selectize'
import { Tags } from '../../../tags/lib/collections'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Alert from 'react-s-alert'
const MultiSelect = ReactSelectize.MultiSelect

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('documentTags', {documentId: props.documentId})
  if (handle.ready() && props.documentId) {
    const documentTags = Tags.find({ parentId: props.documentId, type: 'document' }).fetch()
    onData(null, { documentTags })
  }
}

class DocumentTags extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tagOptions: [
        // {label: 'test', name: 'test', value: 'test'}
      ]
    }
  }
  addTagFromOption (item) {
    Meteor.call('addTagToDocument', item.label, item.value, this.props.documentId, function (err, res) {
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
    console.log(this.refs.documentTags)
    this.refs.documentTags.setState({search: ''})
  }
  render () {
    const { documentTags, documentId } = this.props
    return <div className='user-tags'>
      <MultiSelect
        tabindex='-1'
        onFocus={() => this.props.onFocus()}
        onBlur={() => this.props.onBlur()}
        ref='documentTags'
        anchor={undefined}
        width='200px'
        placeholder='Enter tags here...'
        options={this.state.tagOptions}
        values={documentTags}
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
              }, () => {
                Meteor.call('removeTagFromDocument', item._id, function (err, res) {
                  if (err) {
                    Alert.error('Error: Removing tag \'' + item.label + '.')
                  }
                  if (res) {
                    Alert.success('Success: Removed tag \'' + item.label + '.')
                    console.log(res)
                  }
                })
              })
            }}> &times;</div>
          </div>
        }}
        onValuesChange={(values) => {
          values.forEach((value) => {
            if (!value._id) {
              // insert the value into the database
              Meteor.call('addTagToDocument', value.label, value.value, documentId, function (err, res) {
                if (err) {
                  Alert.error('Error: Adding tag \'' + value.label + '.')
                }
                if (res) {
                  Alert.success('Success: Adding tag \'' + value.label + '.')
                  console.log(res)
                  value._id = res
                }
              })
            }
          })
          documentTags.forEach(function (currentTag) {
            if (values.indexOf(currentTag) === -1) {
              // remove the value from the database
              Meteor.call('removeTagFromDocument', currentTag._id, function (err, res) {
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

DocumentTags.propTypes = {
  documentId: React.PropTypes.string,
  documentTags: React.PropTypes.array,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func
}

export default composeWithTracker(onPropsChange)(DocumentTags)
