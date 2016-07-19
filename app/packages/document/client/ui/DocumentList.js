import React, { Component } from 'react'
// import ReactiveInfiniteList from '../../../infiniteList/client/ui/ReactiveInfiniteList'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { Documents } from '../../lib/collections'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import Loader from 'react-loader'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('documentList')
  if (handle.ready()) {
    let documents = Documents.find({}).fetch()
    onData(null, {documents})
  }
}

class DocumentList extends Component {
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
    const { documents } = this.props
    const ownUserId = Meteor.userId()
    return <div className='document-list container-fluid'>
      <div className='table-responsive'>
        <table className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>Document title</th>
              <th>Author</th>
              <th>Last update</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => {
              const user = Meteor.users.findOne(document.createdBy)
              const isOwnUser = document.createdBy === ownUserId
              return <tr key={'dli-' + document._id} className='document-list-item'>
                <td onClick={() => this.openDocument(document._id)}>{document.title}</td>
                <td onClick={() => this.openDocument(document._id)}>{user.profile.name}</td>
                <td onClick={() => this.openDocument(document._id)}>{document.modifiedAt}</td>
                <td>
                  <ButtonToolbar className='options-buttons'>
                    {isOwnUser ? <Button className='delete-doc-button' bsSize='small' onClick={() => this.deleteDocument(document._id)}>
                      <span className='glyphicon glyphicon-trash' />
                    </Button> : null}
                  </ButtonToolbar>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  }
}

DocumentList.propTypes = {
  documents: React.PropTypes.array
}

// <ReactiveInfiniteList />

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(DocumentList)
