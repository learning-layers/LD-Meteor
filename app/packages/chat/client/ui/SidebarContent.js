import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'
import Nav from '../../../../../node_modules/react-bootstrap/lib/Nav'
import NavItem from '../../../../../node_modules/react-bootstrap/lib/NavItem'
import Image from '../../../../../node_modules/react-bootstrap/lib/Image'

class SidebarContent extends Component {
  componentDidMount () {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template._loginButtons,
      ReactDOM.findDOMNode(this.refs.accountsLoginContainer))
  }
  componentWillUnmount () {
    // Clean up Blaze view
    Blaze.remove(this.view)
  }
  render () {
    return <div className='ld-sidebar-content'>
      <div style={{backgroundColor: 'black', width: '30px', height: '30px', position: 'fixed', top: '40%'}}
        onClick={() => {
          this.props.onSetSidebarOpen(false)
        }
      }>
      </div>
      <Nav ref='accountsLoginContainer'>
        <NavItem style={{float: 'left', height: '68px', width: '78px'}}>
          <Image className='sidebar-avatar' src='https://randomuser.me/api/portraits/thumb/women/2.jpg' circle />
        </NavItem>
        <NavItem className='sidebar-logout' style={{float: 'right'}}>
          <span className='glyphicon glyphicon-off'></span>
        </NavItem>
      </Nav>
      <div className='clearfix'></div>
    </div>
  }
}

export default SidebarContent
