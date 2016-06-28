import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import Tabs from '../../../../../node_modules/react-bootstrap/lib/Tabs'
import Tab from '../../../../../node_modules/react-bootstrap/lib/Tab'
import Row from '../../../../../node_modules/react-bootstrap/lib/Row'
import Col from '../../../../../node_modules/react-bootstrap/lib/Col'
import ReactSelectize from 'react-selectize'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
const SimpleSelect = ReactSelectize.SimpleSelect
import Alert from 'react-s-alert'

class DocumentSharing extends Component {
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
  render () {
    const { documentId } = this.props
    let users = []
    return <div className='document-sharing'>
      Document sharing of {documentId}
      <Tabs defaultActiveKey={2} id='document-sharing-tab'>
        <Tab eventKey={1} title='Users'>
          <Row>
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
            <Col xs={12}>
              <div className='table-responsive'>
                <table className='table table-striped table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                  {users.map((group) => {
                    const isOwnUser = group.createdBy === Meteor.userId()
                    return <tr key={'dli-' + group._id} className='group-list-item'>
                      <td>{group.name}</td>
                      <td>
                        <ButtonToolbar className='options-buttons'>
                          <Button className='delete-group-button' bsSize='small' onClick={() => this.openManageMembersModal(group._id)}>
                            <span className='glyphicon glyphicon-user' />
                            <span className='glyphicon glyphicon-plus' />
                          </Button>
                          {isOwnUser ? <Button className='delete-doc-button' bsSize='small' onClick={() => this.deleteGroup(group._id)}>
                            <span className='glyphicon glyphicon-trash' />
                          </Button> : null}
                        </ButtonToolbar>
                      </td>
                    </tr>
                  })}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={2} title='Groups'>
          Groups
        </Tab>
      </Tabs>
    </div>
  }
}

export default DocumentSharing
