import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { composeWithTracker } from 'react-komposer'
import CollapsibleFilterContainer from './CollapsibleFilterContainer'
import AddFriendModal from './AddFriendModal'
import { FriendRequests, FriendLists } from '../../lib/collections'
import OpenFriendRequests from './OpenFriendRequests'
import InnerFriendList from './InnerFriendList'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'

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
    let friendList = FriendLists.findOne({ userId: Meteor.userId() })
    onData(null, {openFriendRequests, friendList})
  } else {
    const friendRequestsLoading = true
    onData(null, {openFriendRequests, friendRequestsLoading})
  }
}

class FriendList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openAddFriendModal: null
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
  render () {
    const { friendList, openFriendRequests } = this.props
    console.log(openFriendRequests)
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
        {openFriendRequests && openFriendRequests.length > 0 ? (
          <OpenFriendRequests
            openFriendRequests={openFriendRequests}
            friendRequestsLoading={this.props.friendRequestsLoading} />
        ) : null}
        <CollapsibleFilterContainer alwaysOpen filters={['All', 'Online', 'History']} activeFilter={'Online'}>
          <InnerFriendList friendList={friendList} />
        </CollapsibleFilterContainer>
      </div>
    </div>
  }
}

FriendList.propTypes = {
  friendRequestsLoading: React.PropTypes.bool,
  openFriendRequests: React.PropTypes.array,
  friendList: React.PropTypes.object
}

export default composeWithTracker(onPropsChange)(FriendList)
