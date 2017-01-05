import React, { PropTypes } from 'react'

export default function OldSharingLink (props) {
  return (
    <div className='container'>
      <div>
        {'You used an old sharing link.'}
        <br />
        <br />
        <a href={'/document/' + props.documentId} className='btn btn-success'>
          Go to the document
        </a>
        {' to issue a new request for access if necessary.'}
      </div>
    </div>
  )
}

OldSharingLink.propTypes = {
  documentId: PropTypes.string.isRequired
}
