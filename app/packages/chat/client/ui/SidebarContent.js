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
    // let message = 'LabelLabelLabelLabel LabelLabelLabelLabel!HelloWorld' // 'OpieOP haha Kappa lel'
    let message = 'OpieOP haha Kappa lel Lorem ipsum dolor OpieOP amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
    let emotes = {356: ['0-5', '40-45'], 25: ['12-16']}
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
          <div className='chat-message-wrapper'>
            Tab 2 content
            {false ? messageObject.lines.map(function (line) {
              return <div style={{display: 'block', height: '17px'}}>{line}</div>
            }) : null}
            {messageWithEmotesObject.lines.map(function (line, i) {
              let lineHeight = 17
              if (line.containsEmoticons) {
                lineHeight = 26
              }
              return <div style={{display: 'block', height: lineHeight + 'px', overflow: 'visible'}} key={'line-' + i}>{line.lineContents.map(function (lineContent, j) {
                return <div style={{display: 'inline'}} key={'line-' + i + '-content-' + j}>{lineContent}</div>
              })}</div>
            })}
          </div>
        </Tab>
        <Tab eventKey={3} title='Notifications' disabled>Tab 3 content</Tab>
      </Tabs>
    </div>
  }
}

export default SidebarContent
