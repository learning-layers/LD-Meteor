import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { jQuery } from 'meteor/jquery'
import Avatar from './Avatar'
import ChatLineCalculator from '../lib/chatLineCalculator'
import { Uploads } from '../../../fileUpload/lib/collections'
import Nav from '../../../../../node_modules/react-bootstrap/lib/Nav'
import NavItem from '../../../../../node_modules/react-bootstrap/lib/NavItem'
import Accordion from '../../../../../node_modules/react-bootstrap/lib/Accordion'
import Panel from '../../../../../node_modules/react-bootstrap/lib/Panel'
import NavDropdown from '../../../../../node_modules/react-bootstrap/lib/NavDropdown'
import MenuItem from '../../../../../node_modules/react-bootstrap/lib/MenuItem'
import CreateDocumentModal from '../../../../packages/document/client/ui/CreateDocumentModal'
import Tabs from '../../../../../node_modules/react-bootstrap/lib/Tabs'
import Tab from '../../../../../node_modules/react-bootstrap/lib/Tab'
import FriendList from './FriendList'

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
  onData(null, {user, userAvatarPath})
}

class SidebarContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gotDimenstions: false,
      windowWidth: -1,
      openCreateDocumentModal: null
    }
  }
  componentDidMount () {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template._loginButtons,
      ReactDOM.findDOMNode(this.refs.accountsLoginContainer))

    window.addEventListener('resize', this.handleResize.bind(this))
    // let element = ReactDOM.findDOMNode(this.refs.wrapper)
    this.setState({
      gotDimenstions: true,
      windowWidth: jQuery(window).width()
    })
  }
  componentWillUnmount () {
    // Clean up Blaze view
    Blaze.remove(this.view)

    window.removeEventListener('resize', this.handleResize.bind(this))
  }
  handleResize (e) {
    // let element = ReactDOM.findDOMNode(this.refs.wrapper)
    this.setState({
      windowWidth: jQuery(window).width()
    })
  }
  logout () {
    Meteor.logout()
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
    const {userAvatarPath} = this.props
    let messageObject = new ChatLineCalculator().getChatMessageObject('LabelLabelLabelLabelLabelLabelLabelLabel!HelloWorld')
    // let message = 'LabelLabelLabelLabel LabelLabelLabelLabel!HelloWorld' // 'OpieOP haha Kappa lel'
    let message = 'OpieOP haha Kappa lel Lorem ipsum dolor OpieOP amet, consetetur \r\nsadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
    let emotes = {356: ['0-5', '40-45'], 25: ['12-16']}
    let messageWithEmotesObject = new ChatLineCalculator().formatEmotes(message, emotes)
    console.log(messageWithEmotesObject)
    let loggedIn = Meteor.userId()
    return <div className='ld-sidebar-content' ref='wrapper'>
      {this.props.open ? <div className='close-handle' onClick={() => this.props.onSetSidebarOpen(false)}>
        <span className='glyphicon glyphicon-chevron-right' />
      </div> : null}
      <Nav ref='accountsLoginContainer'>
        <NavItem style={{float: 'left', height: '68px', width: '78px'}}>
          <Avatar userAvatarPath={userAvatarPath} />
        </NavItem>
        <NavItem className='sidebar-logout' style={{float: 'right'}} onClick={() => this.logout()}>
          <span className='glyphicon glyphicon-off' />
        </NavItem>
      </Nav>
      <div className='clearfix'></div>
      {this.state.windowWidth < 768 ? <Accordion defaultActiveKey='1'>
        <Panel header='Navigation' eventKey='1'>
          <div ref='createDocumentModal'></div>
          <NavItem eventKey={1} href='/'>
            Home
          </NavItem>
          {loggedIn ? <NavDropdown eventKey={3} title='Document' id='basic-nav-dropdown'>
            <MenuItem eventKey={3.1} onClick={() => this.openCreateDocumentModal()}> New Document</MenuItem>
          </NavDropdown> : null}
        </Panel>
      </Accordion> : null}
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

SidebarContent.propTypes = {
  userAvatarPath: React.PropTypes.string,
  open: React.PropTypes.bool,
  onSetSidebarOpen: React.PropTypes.func
}

export default composeWithTracker(onPropsChange)(SidebarContent)
