import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import Collapse from '../../../../../node_modules/react-bootstrap/lib/Collapse'
import { TimeFromNow } from '../../../../common/client/ui/util/TimeFromNow'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'

class OpenFriendRequests extends Component {
  constructor (props) {
    super(props)
    this.state = {
      friendRequestsShown: false
    }
  }
  toggleOpenFriendRequests () {
    this.setState({
      friendRequestsShown: !this.state.friendRequestsShown
    })
  }
  acceptFriendRequest (friendRequestId) {
    Meteor.call('acceptFriendRequest', friendRequestId, () => {

    })
  }
  denyFriendRequest (friendRequestId) {
    Meteor.call('denyFriendRequest', friendRequestId, () => {

    })
  }
  ignoreFriendRequest (friendRequestId) {
    Meteor.call('ignoreFriendRequest', friendRequestId, () => {

    })
  }
  render () {
    return <span>
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
          <ul>
            {this.props.openFriendRequests.map((openFriendRequest) => {
              return <li>
                <div className='fr-requester'>
                  Requester: {openFriendRequest.requester}
                </div>
                <div className='fr-requested-at'>
                  Requested at: <TimeFromNow date={openFriendRequest.createdAt} />
                </div>
                <div className='options'>
                  <ButtonToolbar>
                    <Button bsSize='small' bsStyle='success' onClick={() => this.acceptFriendRequest(openFriendRequest._id)}>
                      Accept
                    </Button>
                    <Button bsSize='small' bsStyle='danger' onClick={() => this.denyFriendRequest(openFriendRequest._id)}>
                      Deny
                    </Button>
                    <Button bsSize='small' onClick={() => this.ignoreFriendRequest(openFriendRequest._id)}>
                      Ignore
                    </Button>
                  </ButtonToolbar>
                </div>
              </li>
            })}
          </ul>
        </div>
      </Collapse>
      <hr />
    </span>
  }
}

OpenFriendRequests.propTypes = {
  friendRequestsLoading: React.PropTypes.bool,
  openFriendRequests: React.PropTypes.array
}

export default OpenFriendRequests
