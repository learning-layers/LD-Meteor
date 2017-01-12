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
    return (
      <div className='tag-bar'>
        <label htmlFor='document-tags' className={this.state.tagBarFocused ? 'active' : ''}>Tags</label>
        <DocumentTags disabled={this.props.isViewMode} onFocus={() => this.changeTagBarFocus(true)} onBlur={() => this.changeTagBarFocus(false)} documentId={this.props.documentId} />
      </div>
    )
  }
}

TagBar.propTypes = {
  isViewMode: PropTypes.bool.isRequired,
  documentId: PropTypes.string.isRequired
}

export default TagBar

