import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { composeWithTracker } from 'react-komposer'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import CollapsibleFilterContainer from './CollapsibleFilterContainer'
import AddFriendModal from './AddFriendModal'
import Collapse from '../../../../../node_modules/react-bootstrap/lib/Collapse'
import { FriendRequests } from '../../lib/collections'

class ActiveFilterTestComp extends Component {
  render () {
    return <div>{this.props.activeFilter}</div>
  }
}

ActiveFilterTestComp.propTypes = {
  activeFilter: React.PropTypes.bool
}

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('friendList')
  let openFriendRequests = FriendRequests.find({status: 'pending'}).fetch()
  if (handle.ready()) {
    onData(null, {openFriendRequests})
  } else {
    const friendRequestsLoading = true
    onData(null, {openFriendRequests, friendRequestsLoading})
  }
}

class FriendList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openAddFriendModal: null,
      friendRequestsShown: false
    }
  }
  openAddFriendModal () {
    let renderToElement = this.refs.addFriendModal
    if (!this.state.openAddFriendModal) {
      this.state.openAddFriendModal = ReactDOM.render(<AddFriendModal />, renderToElement)
    } else {
      this.state.openAddFriendModal.open()
    }
  }
  toggleOpenFriendRequests () {
    this.setState({
      friendRequestsShown: !this.state.friendRequestsShown
    })
  }
  render () {
    return <div className='ld-friendlist'>
      <div className='top-bar'>
        <Button bsSize='small' onClick={() => this.openAddFriendModal()}>
          <span className='glyphicon glyphicon-plus' />
          &nbsp;Add a friend
        </Button>
        <input type='text' className='form-control' placeholder='Find...' />
        <div ref='addFriendModal'></div>
      </div>
      <hr className='no-margin' />
      <div className='friend-container'>
        {this.state.friendRequestsShown ? <div>
          <div className='collapse-btn' onClick={() => this.toggleOpenFriendRequests()}>
            <span className='glyphicon glyphicon-chevron-down' />
          </div>
          {this.props.friendRequestsLoading ? <span>Open friend requests: Loading...</span> : <span>
            {'Open friend requests: ' + this.props.openFriendRequests.length}
          </span>}
        </div> : <div>
          <div className='collapse-btn closed' onClick={() => this.toggleOpenFriendRequests()}>
            <span className='glyphicon glyphicon-chevron-right' />
          </div>
          {this.props.friendRequestsLoading ? <span>Open friend requests: Loading...</span> : <span>
            {'Open friend requests: ' + this.props.openFriendRequests.length}
          </span>}
        </div>}
        <Collapse in={this.state.friendRequestsShown}>
          <div className='inner-container'>

          </div>
        </Collapse>
        <CollapsibleFilterContainer alwaysOpen filters={['All', 'Online', 'History']} activeFilter={'Online'}>
          Test
          <ActiveFilterTestComp />
        </CollapsibleFilterContainer>
      </div>
    </div>
  }
}

FriendList.propTypes = {
  friendRequestsLoading: React.PropTypes.bool,
  openFriendRequests: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(FriendList)
