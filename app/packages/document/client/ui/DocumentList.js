import React, { Component } from 'react'
import ReactiveInfiniteList from '../../../infiniteList/client/ui/ReactiveInfiniteList'

class DocumentList extends Component {
  render () {
    return <div className='document-list'>
      <ReactiveInfiniteList />
    </div>
  }
}

export default DocumentList
