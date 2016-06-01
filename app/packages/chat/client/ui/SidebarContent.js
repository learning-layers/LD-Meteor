import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'
import Nav from '../../../../../node_modules/react-bootstrap/lib/Nav'
import NavItem from '../../../../../node_modules/react-bootstrap/lib/NavItem'
import Tabs from '../../../../../node_modules/react-bootstrap/lib/Tabs'
import Tab from '../../../../../node_modules/react-bootstrap/lib/Tab'
import FriendList from './FriendList'
import { Meteor } from 'meteor/meteor'
import Avatar from './Avatar'
import ChatLineCalculator from '../lib/chatLineCalculator'

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
  logout () {
    Meteor.logout()
  }
  render () {
    let messageObject = new ChatLineCalculator().getChatMessageObject('LabelLabelLabelLabelLabelLabelLabelLabel!HelloWorld')
    let message = 'OpieOP haha Kappa lel'
    let emotes = {356: ['0-5'], 25: ['12-16']}
    let messageWithEmotesObject = new ChatLineCalculator().formatEmotes(message, emotes)
    console.log(messageWithEmotesObject)
    return <div className='ld-sidebar-content'>
      {this.props.open ? <div className='close-handle' onClick={() => this.props.onSetSidebarOpen(false)}>
        <span className='glyphicon glyphicon-chevron-right' />
      </div> : null}
      <Nav ref='accountsLoginContainer'>
        <NavItem style={{float: 'left', height: '68px', width: '78px'}}>
          <Avatar />
        </NavItem>
        <NavItem className='sidebar-logout' style={{float: 'right'}} onClick={() => this.logout()}>
          <span className='glyphicon glyphicon-off' />
        </NavItem>
      </Nav>
      <div className='clearfix'></div>
      <Tabs defaultActiveKey={1} id='communication-category-tabs'>
        <Tab eventKey={1} title='Friendlist'><FriendList /></Tab>
        <Tab eventKey={2} title='Groups'>
          Tab 2 content
          {messageObject.lines.map(function (line) {
            return <div style={{display: 'block', height: '17px'}}>{line}</div>
          })}
          {messageWithEmotesObject.lines.map(function (line) {
            return <div style={{display: 'block', height: '17px'}}>{line}</div>
          })}
        </Tab>
        <Tab eventKey={3} title='Notifications' disabled>Tab 3 content</Tab>
      </Tabs>
    </div>
  }
}

export default SidebarContent
