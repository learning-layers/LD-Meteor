import React, {Component} from 'react'

class AccessForbidden extends Component {
  render () {
    return <div className='container'>
      <div className='panel panel-danger'>
        <div className='panel-heading'><h2>Access Forbidden</h2></div>
        <div className='panel-body'>
          <div className='access-forbidden-panel-content-wrapper'>
            <img src='/stop-sign-35069.svg' alt='Stop Sign' />
            {'You don\'t have permission to be here...'}
          </div>
        </div>
      </div>
    </div>
  }
}

export default AccessForbidden
