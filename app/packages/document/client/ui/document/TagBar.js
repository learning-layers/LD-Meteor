import React, { Component, PropTypes } from 'react'
import DocumentTags from '../DocumentTags'

class TagBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tagBarFocused: false
    }
  }
  changeTagBarFocus (isFocused) {
    this.setState({
      tagBarFocused: isFocused
    })
  }
  render () {
    const { isViewMode, documentId } = this.props
    return (
      <div className='tag-bar'>
        <label htmlFor='document-tags' className={this.state.tagBarFocused ? 'active' : ''}>Tags</label>
        <DocumentTags disabled={isViewMode} onFocus={() => this.changeTagBarFocus(true)} onBlur={() => this.changeTagBarFocus(false)} documentId={documentId} />
      </div>
    )
  }
}

TagBar.propTypes = {
  isViewMode: PropTypes.bool,
  documentId: PropTypes.string.isRequired
}

export default TagBar

