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
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import FormGroup from '../../../../../node_modules/react-bootstrap/lib/FormGroup'
import FormControl from '../../../../../node_modules/react-bootstrap/lib/FormControl'
import classNames from 'classnames'

function onPropsChange (props, onData) {
  const user = Meteor.user()
  onData(null, {user})
}

class LDNavbar extends Component {
  componentDidMount () {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template._loginButtons,
      ReactDOM.findDOMNode(this.refs.accountsLoginContainer))
  }

  componentWillUnmount () {
    // Clean up Blaze view
    Blaze.remove(this.view)
  }

  openSidebar () {
    global.emitter.emit('sidebar-toggle', true)
  }
  render () {
    let loggedIn = Meteor.userId()
    let navbarClassNames = classNames({'ld-navbar': true, 'logged-in': !!loggedIn})
    return (
      <div className={navbarClassNames}>
        <Navbar fluid bsStyle='default'>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='#'>Living Documents</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href='#'>
                Link
              </NavItem>
              <NavItem eventKey={2} href='#'>
                Link
              </NavItem>
              <NavDropdown eventKey={3} title='Dropdown' id='basic-nav-dropdown'>
                <MenuItem eventKey={3.1}> Action
                </MenuItem>
                <MenuItem eventKey={3.2}> Another action
                </MenuItem>
                <MenuItem eventKey={3.3}> Something else here
                </MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={3.3}> Separated link
                </MenuItem>
              </NavDropdown>
              <NavItem id='nav-app-search' eventKey={4} href='#'>
                <Navbar.Form pullLeft>
                  <FormGroup>
                    <FormControl type='text' placeholder='Search' />
                  </FormGroup>
                  {' '}
                  <Button type='submit'>
                    Submit
                  </Button>
                </Navbar.Form>
              </NavItem>
            </Nav>
            <Nav pullRight ref='accountsLoginContainer'>
              <NavItem eventKey={1} href='#'>
                Link Right
              </NavItem>
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
      </div>
    )
  }
}
export default composeWithTracker(onPropsChange)(LDNavbar)
