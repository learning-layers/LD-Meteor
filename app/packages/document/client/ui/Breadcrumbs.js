import React, {Component} from 'react'

class Breadcrumbs extends Component {
  render () {
    let { breadcrumbs } = this.props
    breadcrumbs = breadcrumbs.map(function (breadcrumb) {
      let activeClass = breadcrumb.current ? 'active' : ''
      return (
        <li key={breadcrumb.documentId}>
          <a href={'#/document/' + breadcrumb.documentId} className={activeClass}>{breadcrumb.documentTitle}</a>
        </li>
      )
    })
    return <div className='breadcrumbs-bar'>
      <div className='lbl'><a>Hierarchy:&nbsp;</a></div>
      <ol className='breadcrumb'>
        {breadcrumbs}
      </ol>
      <div className='clearfix' />
    </div>
  }
}

Breadcrumbs.propTypes = {
  breadcrumbs: React.PropTypes.array
}

export default Breadcrumbs
