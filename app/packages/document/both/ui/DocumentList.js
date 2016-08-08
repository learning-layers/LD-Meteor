import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { composeWithTracker } from 'react-komposer'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'
import { SubsManager } from 'meteor/meteorhacks:subs-manager'
import classNames from 'classnames'
import debounce from 'lodash/debounce'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import { Documents } from '../../lib/collections'
import ReactiveInfiniteList from '../../../infiniteList/both/ui/GeneralReactiveInfiniteList'

let DocumentListSubs = new SubsManager({
  cacheLimit: 2,
  expireIn: 1
})

let initialLimit = 20
const subsName = 'reactiveDocumentList'
let documentListSearchTermObj = {
  searchTerm: ''
}

function onPropsChange (props, onData) {
  let handle = DocumentListSubs.subscribe(subsName, {searchTerm: documentListSearchTermObj.searchTerm, limit: initialLimit})
  let loading = true
  if (handle.ready()) {
    loading = false
    let documents = Documents.find({}, { sort: {name: 1} }).fetch()
    onData(null, {documents, loading})
  } else if (Meteor.isClient) {
    onData(null, {documents: [], loading})
  }
  return () => {
    DocumentListSubs.clear()
  }
}

let highlightText = function (sectionToHighlight, text) {
  if (sectionToHighlight !== '') {
    let splittedText = text.split(sectionToHighlight)
    let count = 0
    return <span>
      {splittedText.map(function (textPart) {
        if (count === 0) {
          count++
          return <span>{textPart}</span>
        } else {
          return <span><span className='highlighted'>{sectionToHighlight}</span>{textPart}</span>
        }
      })}
    </span>
  } else {
    return <span>{text}</span>
  }
}

class ListItem extends Component {
  componentDidMount () {
    this.searchTermSubscription = global.emitter.addListener('documentListSearchTerm', (searchString) => { this.setState({}) })
  }
  componentWillUnmount () {
    if (this.searchTermSubscription) {
      this.searchTermSubscription.remove()
    }
  }
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
    const { colWidth, item, expanded } = this.props
    const document = item
    const user = Meteor.users.findOne(document.createdBy)
    const isOwnUser = document.createdBy === Meteor.userId()
    let documentItemClasses = classNames({'div-table-row document-list-item': true, expanded: expanded})
    return <div key={'dli-' + document._id} className={documentItemClasses}>
      <div className='div-table-col' style={{width: colWidth + 'px'}} onClick={() => this.openDocument(document._id)}>
        {highlightText(documentListSearchTermObj.searchTerm, document.title)}
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
  expanded: React.PropTypes.bool,
  item: React.PropTypes.object,
  colWidth: React.PropTypes.number
}

class DocumentListSearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      documentListSearchTerm: documentListSearchTermObj.searchTerm
    }
  }
  prepareToSearch () {}
  componentWillMount () {
    if (Meteor.isClient) {
      var startSearch = (subsNameCamelCase, argsObj) => {
        Meteor.call('setArgs' + subsNameCamelCase, argsObj)
      }
      // wait until the user starts typing, and then stops
      this.prepareToSearch = debounce(startSearch, 230, {
        'maxWait': 350
      })
    }
  }
  handleSearchInputChange (event, subsName) {
    let searchString = ReactDOM.findDOMNode(event.target).value
    documentListSearchTermObj.searchTerm = searchString
    let subsNameCamelCase = subsName.substring(0, 1).toUpperCase() + subsName.substring(1, subsName.length)
    let documentsLength = 0
    if (this.props.documents) {
      documentsLength = this.props.documents.length
    }
    let argsObj = {limit: documentsLength + 100}
    argsObj.searchTerm = searchString
    this.setState({documentListSearchTerm: searchString})
    this.prepareToSearch(subsNameCamelCase, argsObj)
    global.emitter.emit('documentListSearchTerm', searchString)
  }
  render () {
    return <input type='text'
      style={{margin: '0 auto 14px auto', width: 'calc(100% - 28px)'}}
      onChange={(event) => this.handleSearchInputChange(event, subsName)}
      placeholder='Find...' value={this.state.documentListSearchTerm} />
  }
}

DocumentListSearchBar.propTypes = {
  documents: React.PropTypes.array
}

class DocumentList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      expandedItems: []
    }
  }
  render () {
    const { documents, loading } = this.props
    const expandedItems = this.state.expandedItems
    return <div className='document-list container-fluid'>
      <div style={{textAlign: 'center'}}>
        <DocumentListSearchBar />
      </div>
      {loading ? <div key='document-infinite-scoll-list'>
        <div className='infinite-example-header div-table-header'>
          <div className='div-table-col'>
            Document title
          </div>
          <div className='div-table-col'>
            Author
          </div>
          <div className='div-table-col'>
            Last update
          </div>
          <div className='div-table-col last'>
            Options
          </div>
          <div className='clearfix'></div>
        </div>
        <div className='div-table infinite-example'>
          <div className=''>
            <div>
              <div style={{width: '100%', height: '0px'}}></div>
              <div key='doc-list-loading' className='div-table-row document-list-item'>
                <div className='div-table-col' style={{display: 'block', width: '100%', textAlign: 'center'}}>
                  Loading...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> : <ReactiveInfiniteList
        key='document-infinite-scoll-list'
        additionalMethodArgs={[
          documentListSearchTermObj.searchTerm
        ]}
        normalHeight={46}
        expandedHeight={100}
        expandedItems={expandedItems}
        headerLabels={['Document title', 'Author', 'Last update', 'Options']}
        items={documents}
        ListItemComponent={ListItem}
        subsName={subsName} />
      }
    </div>
  }
}

DocumentList.propTypes = {
  documents: React.PropTypes.array,
  loading: React.PropTypes.bool
}

export default composeWithTracker(onPropsChange)(DocumentList)
