import React, {Component} from 'react'
import classNames from 'classnames'
import { SubsManager } from 'meteor/meteorhacks:subs-manager'
import { Session } from 'meteor/session'
import { composeWithTracker } from 'react-komposer'
import ReactiveInfiniteList from './GeneralReactiveInfiniteList'
import { InfiniteScrollItems } from '../../lib/collections'

let InfiniteScrollItemsSubs = new SubsManager({
  cacheLimit: 2,
  expireIn: 1
})
let initialLimit = 20
let subsSessionLimitName = 'infiniteItemsSubsInitialLimit'
let subsName = 'reactiveInfiniteItems2'
Session.setDefault(subsSessionLimitName, initialLimit)

function onPropsChange (props, onData) {
  let handle = InfiniteScrollItemsSubs.subscribe(subsName, {limit: initialLimit})
  if (handle.ready()) {
    let items = InfiniteScrollItems.find({}, { sort: {name: 1}, limit: Session.get(subsSessionLimitName) }).fetch()
    console.log(items.length)
    onData(null, {items})
  }
  return () => { Session.set(subsSessionLimitName, 20) }
}

class ListItem extends Component {
  render () {
    const { colWidth, item, expanded } = this.props
    let listItemClasses = classNames({'infinite-list-item': true, expanded: expanded})
    return <div ref='listItem' className={'div-table-row ' + listItemClasses}>
      <div className='div-table-col' style={{width: colWidth + 'px'}}>
        List Item {item.name}
      </div>
      <div className='div-table-col last' style={{width: colWidth + 'px'}}>
        {item._id}
      </div>
    </div>
  }
}

ListItem.propTypes = {
  expanded: React.PropTypes.bool,
  item: React.PropTypes.object,
  colWidth: React.PropTypes.number
}

class GeneralReactiveInfiniteListTestWrapper extends Component {
  render () {
    const { items } = this.props
    return <div className='infinite-test-wrapper'>
      <ReactiveInfiniteList
        headerLabels={['Count', 'Id']}
        items={items}
        ListItemComponent={ListItem}
        subsName={subsName}
        subsLimitSessionVarName={subsSessionLimitName} />
    </div>
  }
}

GeneralReactiveInfiniteListTestWrapper.propTypes = {
  items: React.PropTypes.array
}

export default composeWithTracker(onPropsChange)(GeneralReactiveInfiniteListTestWrapper)
