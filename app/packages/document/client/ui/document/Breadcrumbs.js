import { Meteor } from 'meteor/meteor'
import React, { Component, PropTypes } from 'react'

function retrieveBreadcrumbs (documentId, self) {
  Meteor.setTimeout(() => {
    Meteor.call('getSubDocumentBreadcrumbs', documentId, (err, res) => {
      if (err) {
        //
      }
      if (res) {
        self.setState({
          breadcrumbs: res
        })
      }
    })
  }, 100)
}

class Breadcrumbs extends Component {
  constructor (props) {
    super(props)
    this.state = {
      breadcrumbs: []
    }
  }
  componentDidMount () {
    retrieveBreadcrumbs(this.props.documentId, this)
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.documentId !== nextProps.documentId) {
      retrieveBreadcrumbs(nextProps.documentId, this)
    }
  }
  render () {
    const { documentTitle } = this.props
    const { breadcrumbs } = this.state
    return (
      <span>
        {breadcrumbs.length > 0 ? <span>
          <div className='breadcrumbs-bar'>
            <div className='lbl'>
              <a>Parent documents:&nbsp;</a>
            </div>
            <ol className='breadcrumb'>
              {breadcrumbs.map((breadcrumb) => {
                return <li key={`breadcrumb-${breadcrumb._id}`}>
                  <a href={`/document/${breadcrumb.documentId}`}>
                    {breadcrumb.document ? breadcrumb.document.title : 'unknown title'}
                  </a>
                </li>
              })}
              <li>
                <a className='active'>
                  {documentTitle}
                </a>
              </li>
            </ol>
            <div className='clearfix' />
          </div>
          <hr />
        </span> : null}
      </span>
    )
  }
}

Breadcrumbs.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentTitle: PropTypes.string.isRequired
}

export default Breadcrumbs
