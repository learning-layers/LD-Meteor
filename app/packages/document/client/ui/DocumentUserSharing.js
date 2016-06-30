import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import Row from '../../../../../node_modules/react-bootstrap/lib/Row'
import Col from '../../../../../node_modules/react-bootstrap/lib/Col'
import ReactSelectize from 'react-selectize'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
const SimpleSelect = ReactSelectize.SimpleSelect
import Alert from 'react-s-alert'

class DocumentUserSharing extends Component {
  constructor (props) {
    super(props)
    this.state = {
      options: [],
      sharingOptions: [
        {label: 'Can Edit', value: 'CanEdit'},
        {label: 'Can Comment', value: 'CanComment'},
        {label: 'Can View', value: 'CanView'}
      ]
    }
  }
  addUserAccess () {
    let userItem = this.refs.userSelection.state.value
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
    Meteor.call('addDocumentUserAccess', this.props.documentId, userItem.value, camelCase(permissionItem.value), function (err, res) {
      if (err) {
        Alert.error('Error: Sharing the document with user \'' + userItem.label + '.')
      }
      if (res) {
        Alert.success('Success: Sharing the document.')
      }
    })
  }
  removeUserAccess (userId) {
    let result = global.confirm('Do you want to unshare this document with the user ' + userId + '?')
    if (result) {
      Meteor.call('removeDocumentUserAccess', this.props.documentId, userId, function (err, res) {
        if (err) {
          Alert.error('Error: Unsharing the document with user \'' + userId + '.')
        }
        if (res) {
          Alert.success('Success: Unsharing the document.')
        }
      })
    }
  }
  render () {
    const { documentAccess } = this.props
    let haveAccess = []
    if (documentAccess) {
      haveAccess = haveAccess.concat(documentAccess.userCanComment.map(function (userAccessObject) {
        userAccessObject.permission = 'CanComment'
        return userAccessObject
      }))
      haveAccess = haveAccess.concat(documentAccess.userCanView.map(function (userAccessObject) {
        userAccessObject.permission = 'CanView'
        return userAccessObject
      }))
      haveAccess = haveAccess.concat(documentAccess.userCanEdit.map(function (userAccessObject) {
        userAccessObject.permission = 'CanEdit'
        return userAccessObject
      }))
    }
    return <Row>
      <Col xs={12}>
        <br />
      </Col>
      <Col xs={12} md={6}>
        <SimpleSelect
          ref='userSelection'
          options={this.state.options}
          placeholder='Select a user'
          theme='material'
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
                  options: userOptions
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
          placeholder='Select a fruit'
          theme='material'
        />
      </Col>
      <Col xs={12}>
        <ButtonToolbar className='pull-right'>
          <br />
          <Button className='delete-group-button' bsStyle='success' onClick={() => this.addUserAccess()}>
            Add
          </Button>
        </ButtonToolbar>
        <div className='clearfix'></div>
        <hr />
      </Col>
      {documentAccess ? <Col xs={12}>
        <div className='table-responsive'>
          <table className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>User</th>
                <th>Access</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {haveAccess.map((userAccessObj) => {
                let currentUser = Meteor.users.find({'_id': userAccessObj.userId})
                return <tr key={'uao-' + userAccessObj.userId} className='user-access-list-item'>
                  <td>{currentUser && currentUser.profile ? currentUser.profile.name : userAccessObj.userId}</td>
                  <td>{userAccessObj.permission}</td>
                  <td>
                    <ButtonToolbar className='options-buttons'>
                      <Button className='document-unshare-button' bsSize='small' bsStyle='info' onClick={() => this.removeUserAccess(userAccessObj.userId)}>
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

export default DocumentUserSharing
