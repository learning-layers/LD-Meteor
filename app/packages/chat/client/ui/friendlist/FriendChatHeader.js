import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import { compose } from 'react-komposer'
import EventEmitterInstance from '../../../../../common/client/EventEmitter'
import { Tracker } from 'meteor/tracker'

function getTrackerLoader (reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env)
      })
    })

    return () => {
      if (typeof trackerCleanup === 'function') trackerCleanup()
      return handler.stop()
    }
  }
}

function onPropsChange (props, onData) {
  let friend = props.friend
  if (!friend) {
    friend = Meteor.users.findOne({_id: props.friendId})
  }
  onData(null, {friend, friendId: props.friendId})
}

class FriendChatHeader extends Component {
  constructor (props) {
    super(props)
    this.state = {isInfiniteLoading: false}
  }
  componentDidMount () {
    this.isInfiniteLoadingSubscription = EventEmitterInstance.addListener('chat-infinit-loading', (isInfiniteLoading) => {
      this.setState({isInfiniteLoading: isInfiniteLoading})
    })
  }
  componentWillUnmount () {
    if (this.isInfiniteLoadingSubscription) {
      this.isInfiniteLoadingSubscription.remove()
    }
  }
  render () {
    const { friendId, friend } = this.props
    return <div style={{
      display: 'block',
      textAlign: 'center',
      padding: '7px 5px',
      backgroundColor: 'lightgrey',
      height: '35px',
      fontWeight: 'bold'
    }}>
      <span className='glyphicon glyphicon-comment' style={{marginRight: '5px'}} />
      {friend && friend.profile ? friend.profile.name : friendId}
      {this.state.isInfiniteLoading ? <span style={{marginLeft: '7px'}}>Loading...</span> : null}
    </div>
  }
}

FriendChatHeader.propTypes = {
  friend: React.PropTypes.object,
  friendId: React.PropTypes.string
}

export default compose(getTrackerLoader(onPropsChange))(FriendChatHeader)
