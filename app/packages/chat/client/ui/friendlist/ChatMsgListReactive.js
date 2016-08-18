import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { SubsManager } from 'meteor/meteorhacks:subs-manager'
import { composeWithTracker } from 'react-komposer'
import classNames from 'classnames'
import { DirectMessages } from '../../../lib/collections'
import ReactiveInfiniteList from '../../../../infiniteList/client/ui/GeneralReactiveInfiniteList'
import ChatLineCalculator from '../../lib/chatLineCalculator'

const ChatMsgListSubs = new SubsManager({
  cacheLimit: 2,
  expireIn: 1
})

const initialLimit = 20
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
    ]}, {sort: {createdAt: 1}}).fetch()
    onData(null, {friendId: props.friendId, friend, directMessages, loading})
  } else if (Meteor.isClient) {
    onData(null, {friendId: props.friendId, directMessages: [], loading})
  }
  return () => {
    ChatMsgListSubs.clear()
  }
}

class ListItem extends Component {
  render () {
    const { item, expanded } = this.props
    const messageWithEmotesObject = item
    const directMessagesItemClasses = classNames({'div-table-row document-list-item': true, expanded: expanded})
    return <div key={'cmi-' + item._id} className={directMessagesItemClasses} style={{height: messageWithEmotesObject.messageHeight}}>
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
  }
}

ListItem.propTypes = {
  item: React.PropTypes.object,
  expanded: React.PropTypes.bool
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
    return <div id='chat-msg-list' style={{margin: 0, paddingLeft: 0, fontFamily: '\'Droid Sans Mono\', sans-serif', fontSize: '12px'}}>
      <ul></ul>
      <ReactiveInfiniteList
        key='chat-msg-infinite-scoll-list'
        elementHeights={messageElementHeights}
        additionalMethodArgs={[]}
        normalHeight={46}
        expandedHeight={100}
        expandedItems={[]}
        headerLabels={['Chat Messages']}
        items={messageWithEmotesObjects}
        ListItemComponent={ListItem}
        subsName={subsName}
        displayBottomUpwards />
    </div>
  }
}

ChatMsgList.propTypes = {
  directMessages: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(ChatMsgList)
