import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import Navbar from '../../../../../node_modules/react-bootstrap/lib/Navbar'
import Nav from '../../../../../node_modules/react-bootstrap/lib/Nav'
import NavItem from '../../../../../node_modules/react-bootstrap/lib/NavItem'
import NavDropdown from '../../../../../node_modules/react-bootstrap/lib/NavDropdown'
import MenuItem from '../../../../../node_modules/react-bootstrap/lib/MenuItem'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import FormControl from '../../../../../node_modules/react-bootstrap/lib/FormControl'
import classNames from 'classnames'
import Avatar from '../../../../packages/chat/client/ui/Avatar'
import { Uploads } from '../../../../packages/fileUpload/lib/collections'
import CreateDocumentModal from '../../../../packages/document/client/ui/CreateDocumentModal'

function onPropsChange (props, onData) {
  const user = Meteor.user()
  const userAvatar = Uploads.collection.findOne({'meta.parent.uploadType': 'avatar', 'meta.parent.elementId': Meteor.userId()})
  let userAvatarPath
  if (userAvatar) {
    userAvatarPath = userAvatar._downloadRoute + '/' + userAvatar._collectionName + '/' + userAvatar._id + '/original/' + userAvatar._id + '.' + userAvatar.extension
  }
  if (!userAvatarPath) {
    userAvatarPath = '/img/Portrait_placeholder.png'
  }
  onData(null, {user, userAvatarPath})
}

class LDNavbar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openChangeUserRolesModal: null
    }
  }
  componentDidMount () {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template._loginButtons,
      ReactDOM.findDOMNode(this.refs.accountsLoginContainer))
  }
  componentWillUnmount () {
    // cleanup blaze view and react roots
    Blaze.remove(this.view)
    let renderToElement = this.refs.createDocumentModal
    if (this.state.openChangeUserRolesModal !== null) {
      ReactDOM.unmountComponentAtNode(renderToElement)
    }
  }
  openSidebar () {
    global.emitter.emit('sidebar-toggle', true)
  }
  openCreateDocumentModal () {
    let renderToElement = this.refs.createDocumentModal
    if (!this.state.openChangeUserRolesModal) {
      this.state.openChangeUserRolesModal = ReactDOM.render(<CreateDocumentModal />, renderToElement)
    } else {
      this.state.openChangeUserRolesModal.open()
    }
  }
  render () {
    const { userAvatarPath } = this.props
    let loggedIn = Meteor.userId()
    let navbarClassNames = classNames({'ld-navbar': true, 'logged-in': !!loggedIn})
    return (
      <div className={navbarClassNames}>
        <Navbar fluid bsStyle='default'>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='/'>Living Documents</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href='/'>
                Home
              </NavItem>
              {loggedIn ? <NavDropdown eventKey={3} title='Document' id='basic-nav-dropdown'>
                <MenuItem eventKey={3.1} onClick={() => this.openCreateDocumentModal()}> New Document
                </MenuItem>
              </NavDropdown> : null}
              {false && loggedIn ? <NavItem id='nav-app-search' eventKey={4} href='#'>
                <Navbar.Form pullLeft>
                  <FormGroup>
                    <FormControl type='text' placeholder='Search' />
                  </FormGroup>
                </Navbar.Form>
              </NavItem> : null}
            </Nav>
            <Nav pullRight ref='accountsLoginContainer'>
              {loggedIn ? <NavItem className='avatar-nav-item' eventKey={1} href='#'>
                <Avatar userAvatarPath={userAvatarPath} />
              </NavItem> : null}
              <NavItem className='sidebar-nav-item' eventKey={2} href='#' onClick={() => this.openSidebar()}>
                <button className='sidebar-btn'>
                  <span className='icon-bar' />
                  <span className='icon-bar' />
                  <span className='icon-bar' />
                </button>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div ref='createDocumentModal'></div>
      </div>
    )
  }
}
export default composeWithTracker(onPropsChange)(LDNavbar)
