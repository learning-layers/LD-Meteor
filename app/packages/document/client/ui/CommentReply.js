import React, {Component} from 'react'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'

class CommentReply extends Component {
  render () {
    return <div>
      <div className='reply-wrapper'>
        <input className='form-control' placeholder='reply' />
        <ButtonToolbar className='options-bar'>
          <Button bsStyle='success' bsSize='small' onClick={() => this.submitReply()}>Submit Reply</Button>
          <Button bsSize='small' onClick={() => this.closeReply()}>Close</Button>
        </ButtonToolbar>
        <div className='clearfix'></div>
      </div>
      <hr className='no-margin-top' />
    </div>
  }
}

export default CommentReply
