import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import ReactSelectize from 'react-selectize'
import Alert from 'react-s-alert'
import ButtonToolbar from '../../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../../node_modules/react-bootstrap/lib/Button'
import Row from '../../../../../../node_modules/react-bootstrap/lib/Row'
import Col from '../../../../../../node_modules/react-bootstrap/lib/Col'
import { Groups } from '../../../../groups/lib/collections'
const SimpleSelect = ReactSelectize.SimpleSelect
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
  const documentAccess = props.documentAccess
  let haveAccessGroupIds = []
  if (documentAccess) {
    haveAccessGroupIds = haveAccessGroupIds.concat(documentAccess.groupCanComment.map(function (groupAccessObject) {
      return groupAccessObject.groupId
    }))
    haveAccessGroupIds = haveAccessGroupIds.concat(documentAccess.groupCanView.map(function (groupAccessObject) {
      return groupAccessObject.groupId
    }))
    haveAccessGroupIds = haveAccessGroupIds.concat(documentAccess.groupCanEdit.map(function (groupAccessObject) {
      return groupAccessObject.groupId
    }))
  }
  let handle = Meteor.subscribe('groupList', {groupIds: haveAccessGroupIds})
  let handle2 = Meteor.subscribe('groupList')
  let handle3 = Meteor.subscribe('ownGroupsList')
  if (handle.ready() && handle2.ready() && handle3.ready()) {
    const groupSuggestions = Groups.find({'_id': {$nin: haveAccessGroupIds}}).fetch()
    console.log(groupSuggestions)
    onData(null, {groupSuggestions})
  }
}

class DocumentGroupSharing extends Component {
  constructor (props) {
    super(props)
    let groupOptions
    if (props.groupSuggestions) {
      groupOptions = props.groupSuggestions.map(function (group) {
        return {
          label: group.name,
          value: group._id
        }
      })
    }
    this.state = {
      options: groupOptions,
      sharingOptions: [
        {label: 'Can Edit', value: 'CanEdit'},
        {label: 'Can Comment', value: 'CanComment'},
        {label: 'Can View', value: 'CanView'}
      ]
    }
  }
  addGroupAccess () {
    let groupItem = this.refs.groupSelection.state.value
    let permissionItem = this.refs.permissionSelection.state.value
    function camelCase (input) {
      if (input.length > 0) {
        var oldInput = input.substring(1)
        var newfirstletter = input.charAt(0)
        input = newfirstletter.toUpperCase() + oldInput
        return input.replace(/_(.)/g, function (match, group1) {
          return group1.toUpperCase()
        })
      } else {
        return input
      }
    }
    Meteor.call('addDocumentGroupAccess', this.props.documentId, groupItem.value, camelCase(permissionItem.value), function (err, res) {
      if (err) {
        Alert.error('Error: Sharing the document with group \'' + groupItem.label + '.')
      }
      if (res) {
        Alert.success('Success: Sharing the document.')
      }
    })
  }
  removeGroupAccess (groupId) {
    global.window.swal({
      title: 'Unshare document',
      text: 'Do you want to unshare this document with the group ' + groupId + '?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, unshare it!',
      closeOnConfirm: true
    }, (isConfirm) => {
      if (isConfirm) {
        Meteor.call('removeDocumentGroupAccess', this.props.documentId, groupId, function (err, res) {
          if (err) {
            Alert.error('Error: Unsharing the document with group \'' + groupId + '.')
          }
          if (res) {
            Alert.success('Success: Unsharing the document.')
          }
        })
      }
    })
  }
  render () {
    const { documentAccess } = this.props
    let haveAccess = []
    if (documentAccess) {
      haveAccess = haveAccess.concat(documentAccess.groupCanComment.map(function (groupAccessObject) {
        groupAccessObject.permission = 'CanComment'
        return groupAccessObject
      }))
      haveAccess = haveAccess.concat(documentAccess.groupCanView.map(function (groupAccessObject) {
        groupAccessObject.permission = 'CanView'
        return groupAccessObject
      }))
      haveAccess = haveAccess.concat(documentAccess.groupCanEdit.map(function (groupAccessObject) {
        groupAccessObject.permission = 'CanEdit'
        return groupAccessObject
      }))
    }
    return <Row>
      <Col xs={12}>
        <br />
      </Col>
      <Col xs={12} md={6}>
        <SimpleSelect
          ref='groupSelection'
          options={this.state.options}
          placeholder='Select a group'
          theme='material'
          onSearchChange={(search) => {
            Meteor.call('getGroupMentions', {mentionSearch: search}, (err, res) => {
              if (err) {
                //
              }
              if (res) {
                // create new tagOptions
                let groupOptions = res.map(function (group) {
                  return {
                    label: group.name,
                    value: group._id
                  }
                })
                this.setState({
                  options: groupOptions
                })
              }
            })
          }}
        />
      </Col>
      <Col xs={12} md={6}>
        <SimpleSelect
          ref='permissionSelection'
          options={this.state.sharingOptions}
          defaultValue={{label: 'Can Edit', value: 'can_edit'}}
          placeholder='Select a permission'
          theme='material'
        />
      </Col>
      <Col xs={12}>
        <ButtonToolbar className='pull-right'>
          <br />
          <Button className='delete-group-button' bsStyle='success' onClick={() => this.addGroupAccess()}>
            Add
          </Button>
        </ButtonToolbar>
        <div className='clearfix' />
        <hr />
      </Col>
      {documentAccess ? <Col xs={12}>
        <div className='table-responsive'>
          <table className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>Group</th>
                <th>Access</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {haveAccess.map((groupAccessObj) => {
                let currentGroup = Groups.findOne({'_id': groupAccessObj.groupId})
                return <tr key={'gao-' + groupAccessObj.groupId} className='group-access-list-item'>
                  <td>{currentGroup ? currentGroup.name : groupAccessObj.groupId}</td>
                  <td>{groupAccessObj.permission}</td>
                  <td>
                    <ButtonToolbar className='options-buttons'>
                      <Button className='document-unshare-button' bsSize='small' bsStyle='info' onClick={() => this.removeGroupAccess(groupAccessObj.groupId)}>
                        Unshare
                      </Button>
                    </ButtonToolbar>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </Col> : null}
    </Row>
  }
}

DocumentGroupSharing.propTypes = {
  documentId: React.PropTypes.string,
  documentAccess: React.PropTypes.object,
  groupSuggestions: React.PropTypes.array
}

export default compose(getTrackerLoader(onPropsChange))(DocumentGroupSharing)
