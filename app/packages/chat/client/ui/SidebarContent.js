import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'
import Nav from '../../../../../node_modules/react-bootstrap/lib/Nav'
import NavItem from '../../../../../node_modules/react-bootstrap/lib/NavItem'
import Image from '../../../../../node_modules/react-bootstrap/lib/Image'
import Tabs from '../../../../../node_modules/react-bootstrap/lib/Tabs'
import Tab from '../../../../../node_modules/react-bootstrap/lib/Tab'
import FriendList from './FriendList'

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
          <span className='glyphicon glyphicon-off' />
        </NavItem>
      </Nav>
      <div className='clearfix'></div>
      <Tabs defaultActiveKey={1} id='communication-category-tabs'>
        <Tab eventKey={1} title='Friendlist'><FriendList /></Tab>
        <Tab eventKey={2} title='Groups'>Tab 2 content</Tab>
        <Tab eventKey={3} title='Notifications' disabled>Tab 3 content</Tab>
      </Tabs>
    </div>
  }
}

export default SidebarContent
