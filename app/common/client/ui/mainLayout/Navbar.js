import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import EventEmitterInstance from '../../EventEmitter'
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
import RoundTripTimeDisplay from './RoundTripTimeDisplay'

function onPropsChange (props, onData) {
  const user = Meteor.user()
  const userAvatar = Uploads.collection.findOne({'meta.parent.collection': 'user', 'meta.parent.uploadType': 'avatar', 'meta.parent.elementId': Meteor.userId()})
  let userAvatarPath
  if (userAvatar) {
    userAvatarPath = userAvatar._downloadRoute + '/' + userAvatar._collectionName + '/' + userAvatar._id + '/original/' + userAvatar._id + '.' + userAvatar.extension
  }
  if (!userAvatarPath) {
    userAvatarPath = '/img/Portrait_placeholder.png'
  }
  FlowRouter.watchPathChange()
  let routeName = FlowRouter.current()
  onData(null, {user, userAvatarPath, routeName})
}

class LDNavbar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openCreateDocumentModal: null
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
    if (this.state.openCreateDocumentModal !== null) {
      ReactDOM.unmountComponentAtNode(renderToElement)
    }
  }
  openSidebar () {
    EventEmitterInstance.emit('sidebar-toggle', true)
  }
  openCreateDocumentModal () {
    let renderToElement = this.refs.createDocumentModal
    if (!this.state.openCreateDocumentModal) {
      this.state.openCreateDocumentModal = ReactDOM.render(<CreateDocumentModal />, renderToElement)
    } else {
      this.state.openCreateDocumentModal.open()
    }
  }
  render () {
    const { userAvatarPath, routeName } = this.props
    let loggedIn = Meteor.userId()
    let navbarClassNames = classNames({'ld-navbar': true, 'logged-in': !!loggedIn})
    let homeNavClasses = ''
    if (routeName) {
      switch (routeName.pathname) {
        case '/home':
          homeNavClasses += ' active'
          break
        case '/':
          homeNavClasses += ' active'
          break
        case '':
          homeNavClasses += ' active'
          break
      }
    }
    let dontShow = false
    return (
      <div className={navbarClassNames}>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='/'>Living Documents</a>
            </Navbar.Brand>
            <RoundTripTimeDisplay />
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              {loggedIn ? <NavItem eventKey={1} href='/home' className={homeNavClasses}>
                Home
              </NavItem> : <NavItem eventKey={1} href='/' className={homeNavClasses}>
                Home
              </NavItem>}
              {loggedIn ? <NavDropdown eventKey={3} title='Document' id='create-document-dropdown'>
                <MenuItem eventKey={3.1} onClick={() => this.openCreateDocumentModal()}> New Document
                </MenuItem>
              </NavDropdown> : null}
              {dontShow && loggedIn ? <NavItem id='nav-app-search' eventKey={4} href='#'>
                <Navbar.Form pullLeft>
                  <FormGroup>
                    <FormControl type='text' placeholder='Search' />
                  </FormGroup>
                </Navbar.Form>
              </NavItem> : null}
            </Nav>
          </Navbar.Collapse>
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
        </Navbar>
        <div ref='createDocumentModal' />
      </div>
    )
  }
}

LDNavbar.propTypes = {
  userAvatarPath: React.PropTypes.string,
  routeName: React.PropTypes.object
}

export default composeWithTracker(onPropsChange)(LDNavbar)
