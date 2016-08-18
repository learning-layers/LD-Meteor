import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import { SubsManager } from 'meteor/meteorhacks:subs-manager'
import { composeWithTracker } from 'react-komposer'
import { DirectMessages } from '../../../lib/collections'
import ChatLineCalculator from '../../lib/chatLineCalculator'

const ChatMsgListSubs = new SubsManager({
  cacheLimit: 2,
  expireIn: 1
})

const initialLimit = 40
const subsName = 'reactiveChatMsgList'

function onPropsChange (props, onData) {
  const handle = ChatMsgListSubs.subscribe(subsName, {friendId: props.friendId, limit: initialLimit})
  let loading = true
  if (handle.ready()) {
    loading = false
    const friend = Meteor.users.findOne({_id: props.friendId})
    const directMessages = DirectMessages.find({ $or: [
      {from: props.friendId, to: Meteor.userId()},
      {from: Meteor.userId(), to: props.friendId}
    ]}, {sort: {createdAt: -1}}).fetch()
    onData(null, {friendId: props.friendId, friend, directMessages, loading})
  } else if (Meteor.isClient) {
    onData(null, {friendId: props.friendId, directMessages: [], loading})
  }
  return () => {
    ChatMsgListSubs.clear()
  }
}

class ChatMsgList extends Component {
  render () {
    const { directMessages } = this.props
    let messageWithEmotesObjects = []
    let messageElementHeights = []
    directMessages.forEach(function (directMessage) {
      let emotes = directMessage.emotes
      if (!emotes) {
        emotes = []
      }
      let formattedEmotes = {}
      emotes.forEach(function (emoteObj) {
        formattedEmotes[emoteObj.key] = emoteObj.range
      })
      let messageWithEmotesObject = new ChatLineCalculator().formatEmotes(directMessage.message, formattedEmotes)
      messageElementHeights.push(messageWithEmotesObject.messageHeight)
      messageWithEmotesObject._id = directMessage._id
      messageWithEmotesObjects.push(messageWithEmotesObject)
    })
    return <ul ref='scrollCont' style={{
      margin: 0,
      paddingLeft: 0,
      fontFamily: '\'Droid Sans Mono\', sans-serif',
      fontSize: '12px',
      overflow: 'auto',
      height: 'calc(100% - 100px)',
      '-webkit-transform': 'scaleY(-1)',
      '-moz-transform': 'scaleY(-1)',
      '-ms-transform': 'scaleY(-1)',
      '-o-transform': 'scaleY(-1)',
      transform: 'scaleY(-1)',
      display: 'inline-block',
      zoom: 1,
      '*display': 'inline',
      width: '100%'
    }}>
      {directMessages.map(function (directMessage) {
        let emotes = directMessage.emotes
        if (!emotes) {
          emotes = []
        }
        let formattedEmotes = {}
        emotes.forEach(function (emoteObj) {
          formattedEmotes[emoteObj.key] = emoteObj.range
        })
        let messageWithEmotesObject = new ChatLineCalculator().formatEmotes(directMessage.message, formattedEmotes)
        return <li style={{
          listStyle: 'none',
          '-webkit-transform': 'scaleY(-1)',
          '-moz-transform': 'scaleY(-1)',
          '-ms-transform': 'scaleY(-1)',
          '-o-transform': 'scaleY(-1)',
          transform: 'scaleY(-1)'
        }}>
          {messageWithEmotesObject.lines.map(function (line, i) {
            let lineHeight = 17
            if (line.containsEmoticons) {
              lineHeight = 26
            }
            return <div style={{display: 'block', height: lineHeight + 'px', overflow: 'visible'}} key={'line-' + i}>{line.lineContents.map(function (lineContent, j) {
              return <div style={{display: 'inline'}} key={'line-' + i + '-content-' + j}>{lineContent}</div>
            })}</div>
          })}
        </li>
      })}
    </ul>
  }
}

ChatMsgList.propTypes = {
  directMessages: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(ChatMsgList)
