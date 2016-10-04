import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import { Documents, DocumentSelections } from '../../lib/collections'
import EventEmitterInstance from '../../../../common/client/EventEmitter'

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
  toggleSubDocumentArea () {
    EventEmitterInstance.emit('doc-toggle-subdocs', false)
  }
  openSubDocument (documentId) {
    FlowRouter.go('/document/' + documentId)
  }
  render () {
    const { subdocuments } = this.props
    return <div id='subdocument-list' className='panel panel-primary'>
      <div className='panel-heading' style={{height: '53px'}}>
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

export default composeWithTracker(onPropsChange)(SubDocumentDocumentList)
