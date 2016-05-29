import React, {Component} from 'react'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'

class FriendList extends Component {
  render () {
    return <div className='ld-friendlist'>
      <div className='top-bar'>
        <Button bsSize='small'>
          <span className='glyphicon glyphicon-plus' />
          &nbsp;Add a friend
        </Button>
        <input type='text' className='form-control' placeholder='Find...' />
      </div>
      <hr className='no-margin' />
    </div>
  }
}

export default FriendList
