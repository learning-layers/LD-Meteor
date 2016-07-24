import React, { Component } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import Loader from 'react-loader'
import { SubsManager } from 'meteor/meteorhacks:subs-manager'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import { Documents } from '../../lib/collections'
import ReactiveInfiniteList from '../../../infiniteList/client/ui/GeneralReactiveInfiniteList'

let DocumentListSubs = new SubsManager()
let initialLimit = 20
let subsSessionLimitName = 'documentListSubsInitialLimit'
let subsName = 'reactiveDocumentList'
Session.setDefault(subsSessionLimitName, initialLimit)

function onPropsChange (props, onData) {
  let handle = DocumentListSubs.subscribe(subsName, {limit: initialLimit})
  if (handle.ready()) {
    let documents = Documents.find({}, { sort: {name: 1}, limit: Session.get(subsSessionLimitName) }).fetch()
    console.log(documents.length)
    onData(null, {documents})
  }
  return () => { Session.set(subsSessionLimitName, 20) }
}

class ListItem extends Component {
  openDocument (documentId) {
    FlowRouter.go('/document/' + documentId)
  }
  deleteDocument (documentId) {
    const document = Documents.findOne({'_id': documentId})
    if (document) {
      const result = global.confirm('Do you really want to delete the document \'' + document.title + '\'')
      if (result) {
        Meteor.call('deleteDocument', documentId)
      }
    }
  }
  render () {
    const { colWidth, item } = this.props
    const document = item
    const user = Meteor.users.findOne(document.createdBy)
    const isOwnUser = document.createdBy === Meteor.userId()
    return <div ref='listItem' className='div-table-row '>
      <div className='div-table-col' style={{width: colWidth + 'px'}} onClick={() => this.openDocument(document._id)}>
        {document.title}
      </div>
      <div className='div-table-col' style={{width: colWidth + 'px'}} onClick={() => this.openDocument(document._id)}>
        {user.profile.name}
      </div>
      <div className='div-table-col' style={{width: colWidth + 'px'}} onClick={() => this.openDocument(document._id)}>
        {document.modifiedAt}{' '}
      </div>
      <div className='div-table-col last' style={{width: colWidth + 'px'}}>
        <ButtonToolbar className='options-buttons'>
          {isOwnUser ? <Button className='delete-doc-button' bsSize='small' onClick={() => this.deleteDocument(document._id)}>
            <span className='glyphicon glyphicon-trash' />
          </Button> : null}
          {' '}
        </ButtonToolbar>
      </div>
    </div>
  }
}

ListItem.propTypes = {
  item: React.PropTypes.object,
  colWidth: React.PropTypes.number
}

class DocumentList extends Component {
  render () {
    const { documents } = this.props
    // const ownUserId = Meteor.userId()
    return <div className='document-list container-fluid'>
      <ReactiveInfiniteList
        headerLabels={['Document title', 'Author', 'Last update', 'Options']}
        items={documents}
        ListItemComponent={ListItem}
        subsName={subsName}
        subsLimitSessionVarName={subsSessionLimitName} />
    </div>
  }
}

DocumentList.propTypes = {
  documents: React.PropTypes.array
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(DocumentList)
