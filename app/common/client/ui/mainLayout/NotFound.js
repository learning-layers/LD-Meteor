import React, { Component } from 'react'

class NotFound extends Component {
  render () { // TODO add search possibility
    return <div id='not-found' className='container'>
      <div className='panel panel-danger'>
        <div className='panel-heading'><h2>404 - Not Found</h2></div>
        <div className='panel-body'>
          <div className='access-forbidden-panel-content-wrapper'>
            <img src='/smiley-150656.svg' alt='Unhappy Smiley' />
            Sorry we have tried, but we couldn't find anything...&nbsp;&nbsp;
            <a className='btn btn-success' href='/'>Go back to the front page</a>
          </div>
        </div>
      </div>
    </div>
  }
}

export default NotFound
