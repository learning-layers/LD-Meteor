import React, {PropTypes} from 'react'

export default function Breadcrumbs (props) {
  return (
    <span>
      {props.breadcrumbs.length > 0 ? <span>
        <div className='breadcrumbs-bar'>
          <div className='lbl'>
            <a>Parent documents:&nbsp;</a>
          </div>
          <ol className='breadcrumb'>
            {props.breadcrumbs.map((breadcrumb) => {
              return <li key={`breadcrumb-${breadcrumb._id}`}>
                <a href={`/document/${breadcrumb.documentId}`}>
                  {breadcrumb.document ? breadcrumb.document.title : 'unknown title'}
                </a>
              </li>
            })}
            <li>
              <a className='active'>
                {props.documentTitle}
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

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
  documentTitle: PropTypes.string.isRequired
}
