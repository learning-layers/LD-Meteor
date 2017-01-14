import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import { Documents, DocumentSelections } from '../../lib/collections'
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
  let handle = Meteor.subscribe('subdocuments', {parentId: props.documentId})
  if (handle.ready()) {
    const selections = DocumentSelections.find({parentId: props.documentId}).fetch()
    let documentIds = []
    selections.forEach(function (selection) {
      documentIds.push(selection.documentId)
    })
    let subdocuments = Documents.find({_id: {$in: documentIds}}).fetch()
    onData(null, { subdocuments })
  }
}

class SubDocumentDocumentList extends Component {
  openSubDocument (documentId) {
    FlowRouter.go('/document/' + documentId)
  }
  render () {
    const { subdocuments } = this.props
    return <div id='subdocument-list' className='panel panel-primary'>
      <div className='panel-heading'>
        Subdocuments
      </div>
      <div className='panel-body'>
        <ul className='s-document-list'>
          {subdocuments.map((subdocument) => {
            return <li key={subdocument._id}>
              <div>{subdocument.title}</div>
              <button className='btn btn-default btn-sm' onClick={() => this.openSubDocument(subdocument._id)}>Open</button>
            </li>
          })}
        </ul>
      </div>
    </div>
  }
}

SubDocumentDocumentList.propTypes = {
  subdocuments: React.PropTypes.array
}

export default compose(getTrackerLoader(onPropsChange))(SubDocumentDocumentList)
